/**
 * 文案生成路由
 */
const express = require('express');
const copywritingController = require('../controllers/copywriting.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// 获取文案模板列表
router.get('/templates', copywritingController.getTemplates);

// 生成文案
router.post('/generate', protect, copywritingController.generateCopy);

// 分析文案
router.post('/analyze', protect, copywritingController.analyzeCopy);

// 获取用户的文案历史记录
router.get('/history', protect, copywritingController.getCopyHistory);

// 获取特定文案详情
router.get('/:id', protect, copywritingController.getCopy);

module.exports = router; 