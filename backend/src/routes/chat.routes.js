/**
 * 聊天相关路由
 */

const express = require('express');
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// 所有聊天路由都需要认证
router.use(protect);

// 发送聊天消息
router.post('/message', chatController.sendMessage);

// 重新生成消息
router.post('/regenerate/:id', chatController.regenerateMessage);

// 使用插件
router.post('/plugin/:messageId', chatController.usePlugin);

module.exports = router; 