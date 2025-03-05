/**
 * 认证相关中间件
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const { logger } = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config');

// 模拟用户数据
const users = [
  {
    id: 'user-1',
    name: '测试用户',
    email: 'test@example.com',
    role: 'user',
    password: '$2a$12$q7GzXfDb9BfSH8p7I/n0B.o8MrNvGQn9g8gzJ3NiZ0OuEgj4n3ZFy' // 密码: password123
  },
  {
    id: 'admin-1',
    name: '管理员',
    email: 'admin@example.com',
    role: 'admin',
    password: '$2a$12$q7GzXfDb9BfSH8p7I/n0B.o8MrNvGQn9g8gzJ3NiZ0OuEgj4n3ZFy' // 密码: password123
  }
];

/**
 * 保护路由中间件 - 验证用户是否已登录
 */
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) 获取token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('您未登录！请登录后访问。', 401));
  }

  // 2) 验证token
  let decoded;
  try {
    decoded = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return next(new AppError('无效的令牌。请重新登录！', 401));
  }

  // 3) 检查用户是否仍然存在
  const currentUser = users.find(user => user.id === decoded.id);
  if (!currentUser) {
    return next(new AppError('此令牌的用户不再存在。', 401));
  }

  // 4) 将用户信息添加到请求对象
  req.user = currentUser;
  next();
});

/**
 * 限制角色访问中间件
 * @param  {...String} roles 允许访问的角色数组
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('您没有权限执行此操作！', 403));
    }
    next();
  };
};

/**
 * 模拟登录函数
 * 在实际应用中，这应该在auth.controller.js中
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) 检查邮箱和密码是否存在
  if (!email || !password) {
    return next(new AppError('请提供邮箱和密码！', 400));
  }

  // 2) 检查用户是否存在
  const user = users.find(u => u.email === email);
  if (!user) {
    return next(new AppError('邮箱或密码不正确！', 401));
  }

  // 3) 在实际应用中，这里应该验证密码
  // 为了简化测试，我们假设密码是正确的
  
  // 4) 生成JWT
  const token = jwt.sign(
    { id: user.id },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  // 5) 发送响应
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
}); 