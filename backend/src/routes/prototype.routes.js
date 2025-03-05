/**
 * 原型生成路由
 */
const express = require('express');
const prototypeController = require('../controllers/prototype.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// 获取原型模板列表
router.get('/templates', prototypeController.getTemplates);

// 生成原型
router.post('/generate', protect, prototypeController.generatePrototype);

// 获取用户的原型历史记录
router.get('/history', protect, prototypeController.getPrototypeHistory);

// 获取特定原型详情
router.get('/:id', protect, prototypeController.getPrototype);

module.exports = router; 