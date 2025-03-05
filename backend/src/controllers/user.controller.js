/**
 * 用户控制器
 */

const User = require('../models/user.model');
const AppError = require('../utils/appError');

/**
 * 获取所有用户
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 获取特定用户
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
 * 创建用户
 */
exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role
    });

    // 移除密码字段
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 更新用户
 */
exports.updateUser = async (req, res, next) => {
  try {
    // 不允许通过此路由更新密码
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          '此路由不用于密码更新。请使用 /update-password',
          400
        )
      );
    }

    // 过滤掉不允许更新的字段
    const filteredBody = {};
    const allowedFields = ['name', 'email', 'role'];
    Object.keys(req.body).forEach(el => {
      if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return next(new AppError('未找到该ID的用户', 404));
    }

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
 * 删除用户
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError('未找到该ID的用户', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
}; 