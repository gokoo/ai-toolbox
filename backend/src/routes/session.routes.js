/**
 * 会话相关路由
 */

const express = require('express');
const sessionController = require('../controllers/session.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// 所有会话路由都需要认证
router.use(protect);

// 获取所有会话
router.get('/', sessionController.getSessions);

// 创建新会话
router.post('/', sessionController.createSession);

// 获取特定会话
router.get('/:id', sessionController.getSession);

// 更新会话
router.patch('/:id', sessionController.updateSession);

// 删除会话
router.delete('/:id', sessionController.deleteSession);

// 清空会话消息
router.delete('/:id/messages', sessionController.clearSessionMessages);

// 获取会话消息
router.get('/:id/messages', sessionController.getSessionMessages);

module.exports = router; 