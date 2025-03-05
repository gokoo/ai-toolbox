/**
 * 消息相关路由
 */

const express = require('express');
const messageController = require('../controllers/message.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// 所有消息路由都需要认证
router.use(protect);

// 创建新消息
router.post('/', messageController.createMessage);

// 获取特定消息
router.get('/:id', messageController.getMessage);

// 更新消息
router.patch('/:id', messageController.updateMessage);

// 删除消息
router.delete('/:id', messageController.deleteMessage);

// 更新工具状态
router.patch('/:id/tools/:toolId', messageController.updateToolState);

module.exports = router; 