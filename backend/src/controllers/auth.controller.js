/**
 * 认证控制器
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const config = require('../config');

/**
 * 生成JWT令牌
 * @param {string} id - 用户ID
 * @returns {string} JWT令牌
 */
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * 创建并发送JWT令牌
 * @param {Object} user - 用户对象
 * @param {number} statusCode - HTTP状态码
 * @param {Object} res - 响应对象
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // 移除密码字段
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/**
 * 用户注册
 */
exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role || 'user'
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

/**
 * 用户登录
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) 检查邮箱和密码是否存在
    if (!email || !password) {
      return next(new AppError('请提供邮箱和密码', 400));
    }

    // 2) 检查用户是否存在及密码是否正确
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('邮箱或密码不正确', 401));
    }

    // 3) 如果一切正常，发送令牌给客户端
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * 用户登出
 */
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

/**
 * 忘记密码
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) 根据提交的邮箱获取用户
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('该邮箱地址没有用户', 404));
    }

    // 2) 生成随机重置令牌
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) 发送邮件到用户邮箱
    try {
      // 这里应该有发送邮件的逻辑，暂时模拟
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/auth/reset-password/${resetToken}`;

      res.status(200).json({
        status: 'success',
        message: '重置令牌已发送到邮箱',
        resetURL // 实际生产环境不应该返回这个URL
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('发送邮件时出错。请稍后再试！', 500)
      );
    }
  } catch (err) {
    next(err);
  }
};

/**
 * 重置密码
 */
exports.resetPassword = async (req, res, next) => {
  try {
    // 1) 根据令牌获取用户
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) 如果令牌未过期且用户存在，设置新密码
    if (!user) {
      return next(new AppError('令牌无效或已过期', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) 更新changedPasswordAt属性
    // 在用户模型中处理

    // 4) 登录用户，发送JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * 更新密码
 */
exports.updatePassword = async (req, res, next) => {
  try {
    // 1) 获取用户
    const user = await User.findById(req.user.id).select('+password');

    // 2) 检查当前密码是否正确
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('您的当前密码不正确', 401));
    }

    // 3) 更新密码
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) 登录用户，发送JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * 获取当前用户信息
 */
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/**
 * 获取用户信息
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new AppError('未找到该ID的用户', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 更新当前用户信息
 */
exports.updateMe = async (req, res, next) => {
  try {
    // 1) 如果用户尝试更新密码，返回错误
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          '此路由不用于密码更新。请使用 /update-password',
          400
        )
      );
    }

    // 2) 过滤掉不允许更新的字段
    const filteredBody = {};
    const allowedFields = ['name', 'email'];
    Object.keys(req.body).forEach(el => {
      if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    // 3) 更新用户文档
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 删除当前用户
 */
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
}; 