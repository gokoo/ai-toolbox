/**
 * 原型生成控制器
 */
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// 模拟原型模板数据
const prototypeTemplates = [
  {
    id: 'web-app',
    name: '网页应用',
    description: '适合创建网页应用界面原型',
    category: 'web',
    previewImage: 'https://example.com/images/web-app-preview.jpg'
  },
  {
    id: 'mobile-app',
    name: '移动应用',
    description: '适合创建移动应用界面原型',
    category: 'mobile',
    previewImage: 'https://example.com/images/mobile-app-preview.jpg'
  },
  {
    id: 'dashboard',
    name: '数据仪表盘',
    description: '适合创建数据可视化仪表盘原型',
    category: 'web',
    previewImage: 'https://example.com/images/dashboard-preview.jpg'
  },
  {
    id: 'landing-page',
    name: '落地页',
    description: '适合创建营销落地页原型',
    category: 'web',
    previewImage: 'https://example.com/images/landing-page-preview.jpg'
  }
];

// 模拟原型数据
const prototypes = [];

/**
 * 获取原型模板列表
 */
exports.getTemplates = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      templates: prototypeTemplates
    }
  });
});

/**
 * 生成原型
 */
exports.generatePrototype = asyncHandler(async (req, res, next) => {
  const { templateId, description, elements, style } = req.body;

  // 验证必要参数
  if (!templateId || !description) {
    return next(new AppError('请提供模板ID和描述', 400));
  }

  // 查找模板
  const template = prototypeTemplates.find(t => t.id === templateId);
  if (!template) {
    return next(new AppError('未找到指定模板', 404));
  }

  // 模拟生成原型过程
  // 在实际应用中，这里会调用AI服务生成原型
  const prototype = {
    id: `prototype-${Date.now()}`,
    userId: req.user.id,
    templateId,
    description,
    elements: elements || '',
    style: style || '',
    createdAt: new Date().toISOString(),
    status: 'completed',
    previewUrl: `https://example.com/prototypes/${templateId}-preview.html`,
    downloadUrl: `https://example.com/prototypes/${templateId}-download.zip`
  };

  // 保存原型记录
  prototypes.push(prototype);

  // 返回结果
  res.status(201).json({
    status: 'success',
    data: prototype
  });
});

/**
 * 获取用户的原型历史记录
 */
exports.getPrototypeHistory = asyncHandler(async (req, res, next) => {
  // 获取当前用户的原型历史
  const userPrototypes = prototypes.filter(p => p.userId === req.user.id);

  res.status(200).json({
    status: 'success',
    results: userPrototypes.length,
    data: {
      prototypes: userPrototypes
    }
  });
});

/**
 * 获取特定原型详情
 */
exports.getPrototype = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 查找原型
  const prototype = prototypes.find(p => p.id === id && p.userId === req.user.id);
  if (!prototype) {
    return next(new AppError('未找到指定原型', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      prototype
    }
  });
}); 