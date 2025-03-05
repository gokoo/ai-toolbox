/**
 * 插件网关路由
 * 用于处理插件API请求的转发
 */

const express = require('express');
const pluginGatewayController = require('../controllers/plugin-gateway.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// 所有插件网关请求都需要认证
router.use(protect);

// 处理内置插件API请求
router.all('/builtin/:pluginId/:apiName', pluginGatewayController.handleBuiltinPluginRequest);

// 处理自定义插件API请求
router.all('/:pluginId/:apiName', pluginGatewayController.handlePluginRequest);

module.exports = router; 