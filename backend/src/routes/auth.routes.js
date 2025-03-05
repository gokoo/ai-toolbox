/**
 * 认证相关路由
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect, login } = require('../middlewares/auth');

const router = express.Router();

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', login);

// 登出
router.get('/logout', authController.logout);

// 忘记密码
router.post('/forgot-password', authController.forgotPassword);

// 重置密码
router.patch('/reset-password/:token', authController.resetPassword);

// 需要认证的路由
router.use(protect);

// 更新密码
router.patch('/update-password', authController.updatePassword);

// 获取当前用户信息
router.get('/me', authController.getMe, authController.getUser);

// 更新当前用户信息
router.patch('/update-me', authController.updateMe);

// 删除当前用户
router.delete('/delete-me', authController.deleteMe);

module.exports = router; 