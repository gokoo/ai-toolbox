/**
 * 文案生成控制器
 */
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const { OpenAI } = require('openai');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const { logger } = require('../utils/logger');

// 初始化OpenAI客户端
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  logger.warn('OpenAI API初始化失败，将使用模拟数据');
}

// 模拟文案模板数据
const copywritingTemplates = [
  {
    id: 'social-media',
    name: '社交媒体文案',
    description: '适合微信、微博等社交媒体平台的短文案',
    category: 'social',
    previewImage: 'https://example.com/images/social-media-preview.jpg'
  },
  {
    id: 'product-description',
    name: '产品描述',
    description: '详细介绍产品特点和优势的文案',
    category: 'marketing',
    previewImage: 'https://example.com/images/product-description-preview.jpg'
  },
  {
    id: 'ad-copy',
    name: '广告文案',
    description: '吸引用户点击或购买的广告文案',
    category: 'marketing',
    previewImage: 'https://example.com/images/ad-copy-preview.jpg'
  },
  {
    id: 'email-newsletter',
    name: '邮件通讯',
    description: '适合邮件营销的通讯文案',
    category: 'email',
    previewImage: 'https://example.com/images/email-newsletter-preview.jpg'
  }
];

// 模拟文案数据
const copies = [];

/**
 * 获取文案模板列表
 */
exports.getTemplates = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      templates: copywritingTemplates
    }
  });
});

/**
 * 生成文案
 */
exports.generateCopy = asyncHandler(async (req, res, next) => {
  const { templateId, product, audience, tone, keywords } = req.body;

  // 验证必要参数
  if (!templateId || !product) {
    return next(new AppError('请提供模板ID和产品/服务名称', 400));
  }

  // 查找模板
  const template = copywritingTemplates.find(t => t.id === templateId);
  if (!template) {
    return next(new AppError('未找到指定模板', 404));
  }

  // 模拟生成文案过程
  // 在实际应用中，这里会调用AI服务生成文案
  let content = '';
  
  switch (template.id) {
    case 'social-media':
      content = `【${product}】新品上市！\n\n${audience ? `专为${audience}打造，` : ''}${keywords ? `${keywords}，` : ''}让您的生活更加便捷。\n\n${tone === '幽默' ? '别犹豫了，错过这款神器，你的朋友圈都要笑话你啦！' : '现在下单，即可享受限时优惠，快来体验吧！'}`;
      break;
    case 'product-description':
      content = `# ${product}产品介绍\n\n## 产品概述\n\n${product}是一款${keywords || '高效、智能、便捷'}的产品，${audience ? `专为${audience}设计，` : ''}旨在解决用户在日常生活或工作中遇到的各种挑战。\n\n## 核心特点\n\n- 简单易用：直观的界面设计，无需专业知识即可上手\n- 高效可靠：采用先进技术，确保稳定高效的性能\n- 智能辅助：内置AI算法，提供智能化服务\n- 安全保障：多重安全机制，保护用户数据安全\n\n## 适用场景\n\n无论是在家庭环境还是专业工作场所，${product}都能满足您的需求。它特别适合${audience || '各类用户'}在日常生活和工作中使用。\n\n## 为什么选择我们\n\n选择${product}，就是选择品质和专业。我们致力于为用户提供最佳体验，不断创新和完善产品功能。`;
      break;
    case 'ad-copy':
      content = `# ${tone || '专业'}的选择，就是${product}\n\n想要${keywords || '高效、便捷'}的体验吗？${product}为您提供最佳解决方案！\n\n${audience ? `作为${audience}，` : ''}您值得拥有更好的工具。${product}，让您的每一天都充满可能。\n\n**立即行动！**访问我们的网站或联系客服，了解更多详情。`;
      break;
    case 'email-newsletter':
      content = `主题：${product}最新资讯 - 为您带来更多精彩\n\n亲爱的${audience || '用户'}，\n\n感谢您一直以来对${product}的支持与关注！\n\n我们很高兴地通知您，${product}推出了一系列新功能，这些功能将为您带来更${keywords || '高效、便捷'}的使用体验。\n\n## 本月更新\n\n- 全新界面设计，更加直观易用\n- 性能优化，运行速度提升30%\n- 新增多项实用功能，满足您的多样化需求\n- 安全性升级，为您的数据提供更强保障\n\n立即更新您的应用，体验这些令人兴奋的新功能！\n\n如有任何问题或建议，欢迎随时联系我们的客服团队。\n\n祝您使用愉快！\n\n${product}团队敬上`;
      break;
    default:
      content = `关于${product}的文案\n\n${product}是一款出色的产品/服务，${audience ? `专为${audience}设计，` : ''}具有${keywords || '多种优势和特点'}。\n\n无论您是需要提高效率、解决问题还是改善体验，${product}都能满足您的需求。\n\n立即了解更多信息，开启全新体验！`;
  }

  // 创建文案记录
  const copy = {
    id: `copy-${Date.now()}`,
    userId: req.user.id,
    templateId,
    product,
    audience: audience || '',
    tone: tone || '',
    keywords: keywords || '',
    content,
    createdAt: new Date().toISOString()
  };

  // 保存文案记录
  copies.push(copy);

  // 返回结果
  res.status(201).json({
    status: 'success',
    data: copy
  });
});

/**
 * 分析文案
 */
exports.analyzeCopy = asyncHandler(async (req, res, next) => {
  const { content, audience, platform } = req.body;

  // 验证必要参数
  if (!content) {
    return next(new AppError('请提供文案内容', 400));
  }

  // 模拟文案分析过程
  // 在实际应用中，这里会调用AI服务分析文案
  const wordCount = content.length;
  const readingTime = Math.ceil(wordCount / 500); // 假设平均阅读速度为500字/分钟
  
  // 简单情感分析
  let sentiment = '中性';
  if (content.includes('优惠') || content.includes('惊喜') || content.includes('好评')) {
    sentiment = '积极';
  } else if (content.includes('问题') || content.includes('遗憾') || content.includes('抱歉')) {
    sentiment = '消极';
  }
  
  // 生成分析结果
  const analysis = `## 文案分析报告\n\n### 基本信息\n- 字数：${wordCount}字\n- 预估阅读时间：${readingTime}分钟\n- 情感倾向：${sentiment}\n\n### 目标受众适配度\n${audience ? `针对"${audience}"受众，该文案` : '该文案'}的表达方式${sentiment === '积极' ? '积极正面，有较强的吸引力' : sentiment === '消极' ? '存在一些消极表达，可能影响受众接受度' : '表达中性，信息传达清晰'}。\n\n### 平台适配度\n${platform ? `对于"${platform}"平台，该文案` : '该文案'}的长度和风格${wordCount > 1000 ? '较长，适合详细内容展示平台' : wordCount > 300 ? '中等长度，适合大多数平台' : '简短精炼，适合快速阅读的平台'}。\n\n### 改进建议\n- ${sentiment !== '积极' ? '增加一些积极正面的表达，提高文案感染力' : '保持当前的积极基调，可以适当增加一些数据支持'}\n- ${wordCount > 500 ? '考虑精简内容，突出核心卖点' : '可以适当丰富内容，增加产品/服务的详细描述'}\n- 增加明确的行动召唤(CTA)，引导读者采取下一步行动`;

  // 返回结果
  res.status(200).json({
    status: 'success',
    data: {
      content,
      wordCount,
      readingTime,
      sentiment,
      targetAudience: audience || '一般受众',
      platform: platform || '通用平台',
      analysis
    }
  });
});

/**
 * 获取用户的文案历史记录
 */
exports.getCopyHistory = asyncHandler(async (req, res, next) => {
  // 获取当前用户的文案历史
  const userCopies = copies.filter(c => c.userId === req.user.id);

  res.status(200).json({
    status: 'success',
    results: userCopies.length,
    data: {
      copies: userCopies
    }
  });
});

/**
 * 获取特定文案详情
 */
exports.getCopy = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 查找文案
  const copy = copies.find(c => c.id === id && c.userId === req.user.id);
  if (!copy) {
    return next(new AppError('未找到指定文案', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      copy
    }
  });
}); 