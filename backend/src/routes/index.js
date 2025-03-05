/**
 * API路由入口文件
 */

const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const translateRoutes = require('./translate.routes');
const prototypeRoutes = require('./prototype.routes');
const copywritingRoutes = require('./copywriting.routes');
const pluginRoutes = require('./plugin.routes');
const pluginGatewayRoutes = require('./plugin-gateway.routes');
const sessionRoutes = require('./session.routes');
const messageRoutes = require('./message.routes');
const chatRoutes = require('./chat.routes');

const router = express.Router();

// 健康检查路由
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 注册各模块路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/translate', translateRoutes);
router.use('/prototype', prototypeRoutes);
router.use('/copywriting', copywritingRoutes);
router.use('/plugins', pluginRoutes);
router.use('/plugin-gateway', pluginGatewayRoutes);
router.use('/sessions', sessionRoutes);
router.use('/messages', messageRoutes);
router.use('/chat', chatRoutes);

module.exports = router; 