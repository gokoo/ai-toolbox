/**
 * 插件相关路由
 */

const express = require('express');
const pluginController = require('../controllers/plugin.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// 获取插件商店列表 - 公共访问
router.get('/store', pluginController.getPluginStore);

// 从URL获取插件清单 - 公共访问
router.get('/manifest', pluginController.getPluginManifestFromUrl);

// 以下路由需要认证
router.use(protect);

// 获取用户安装的所有插件
router.get('/', pluginController.getInstalledPlugins);

// 安装插件
router.post('/install', pluginController.installPlugin);

// 创建自定义插件
router.post('/custom', pluginController.createCustomPlugin);

// 更新插件
router.patch('/:id', pluginController.updatePlugin);

// 更新插件设置
router.patch('/:id/settings', pluginController.updatePluginSettings);

// 更新插件清单
router.patch('/:id/manifest', pluginController.updatePluginManifest);

// 卸载插件
router.delete('/:id', pluginController.uninstallPlugin);

// 删除所有插件
router.delete('/', pluginController.removeAllPlugins);

module.exports = router; 