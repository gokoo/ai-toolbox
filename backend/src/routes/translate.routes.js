/**
 * 翻译相关路由
 */

const express = require('express');
const translateController = require('../controllers/translate.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// 公共路由
router.get('/languages', translateController.getLanguages);

// 需要认证的路由
router.use(protect);

// 翻译文本
router.post('/text', translateController.translateText);

// 翻译文件
router.post('/file', translateController.translateFile);

// 获取翻译历史
router.get('/history', translateController.getHistory);

// 获取特定翻译历史
router.get('/history/:id', translateController.getHistoryById);

// 删除翻译历史
router.delete('/history/:id', translateController.deleteHistory);

// 导出翻译结果
router.post('/export', translateController.exportTranslation);

module.exports = router; 