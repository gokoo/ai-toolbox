/**
 * 用户相关路由
 */

const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// 所有用户路由都需要认证
router.use(protect);

// 获取所有用户 - 仅管理员可访问
router.get('/', restrictTo('admin'), userController.getAllUsers);

// 获取特定用户 - 仅管理员可访问
router.get('/:id', restrictTo('admin'), userController.getUser);

// 创建用户 - 仅管理员可访问
router.post('/', restrictTo('admin'), userController.createUser);

// 更新用户 - 仅管理员可访问
router.patch('/:id', restrictTo('admin'), userController.updateUser);

// 删除用户 - 仅管理员可访问
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router; 