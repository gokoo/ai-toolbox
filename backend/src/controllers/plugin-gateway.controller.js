/**
 * 插件网关控制器
 * 用于处理插件API请求的转发
 */

const axios = require('axios');
const Plugin = require('../models/plugin.model');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { isValidUrl } = require('../utils/validators');

/**
 * 处理插件API请求
 */
exports.handlePluginRequest = asyncHandler(async (req, res, next) => {
  const { pluginId, apiName } = req.params;
  const { method, headers, query, body } = req;

  // 查找插件
  const plugin = await Plugin.findOne({
    _id: pluginId,
    user: req.user.id,
  });

  if (!plugin) {
    return next(new AppError('未找到插件', 404));
  }

  // 查找API定义
  const apiDef = plugin.manifest.api?.find((api) => api.name === apiName);

  if (!apiDef) {
    return next(new AppError(`插件 ${plugin.identifier} 中未找到API: ${apiName}`, 404));
  }

  // 构建请求URL
  let apiUrl = apiDef.url;
  
  // 如果是自定义插件，可能需要处理URL
  if (plugin.type === 'customPlugin' && plugin.customParams?.apiMode === 'proxy') {
    // 检查是否有基础URL
    const baseUrl = plugin.customParams.baseUrl;
    if (!baseUrl || !isValidUrl(baseUrl)) {
      return next(new AppError('自定义插件缺少有效的基础URL', 400));
    }
    
    // 构建完整URL
    apiUrl = `${baseUrl}${apiUrl}`;
  }

  try {
    // 准备请求配置
    const requestConfig = {
      method: apiDef.method || method,
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      params: query,
    };

    // 添加请求体（如果有）
    if (['POST', 'PUT', 'PATCH'].includes(requestConfig.method.toUpperCase())) {
      requestConfig.data = body;
    }

    // 添加插件设置到请求头
    if (plugin.settings && Object.keys(plugin.settings).length > 0) {
      requestConfig.headers['X-Plugin-Settings'] = JSON.stringify(plugin.settings);
    }

    // 发送请求
    const response = await axios(requestConfig);

    // 返回响应
    res.status(response.status).json(response.data);
  } catch (error) {
    // 处理错误
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    
    return next(new AppError(`插件API请求失败: ${errorMessage}`, statusCode));
  }
});

/**
 * 处理内置插件API请求
 */
exports.handleBuiltinPluginRequest = asyncHandler(async (req, res, next) => {
  const { pluginId, apiName } = req.params;
  
  // 根据插件ID和API名称路由到相应的控制器
  switch (pluginId) {
    case 'ai-prototype':
      return handlePrototypeRequest(apiName, req, res, next);
    
    case 'ai-copywriting':
      return handleCopywritingRequest(apiName, req, res, next);
    
    case 'i18n-translator':
      return handleTranslatorRequest(apiName, req, res, next);
    
    default:
      return next(new AppError(`未找到内置插件: ${pluginId}`, 404));
  }
});

/**
 * 处理原型生成插件请求
 */
const handlePrototypeRequest = (apiName, req, res, next) => {
  const prototypeController = require('./prototype.controller');
  
  switch (apiName) {
    case 'getTemplates':
      return prototypeController.getTemplates(req, res, next);
    
    case 'generatePrototype':
      return prototypeController.generatePrototype(req, res, next);
    
    case 'getHistory':
      return prototypeController.getPrototypeHistory(req, res, next);
    
    default:
      return next(new AppError(`未找到原型生成插件API: ${apiName}`, 404));
  }
};

/**
 * 处理文案生成插件请求
 */
const handleCopywritingRequest = (apiName, req, res, next) => {
  const copywritingController = require('./copywriting.controller');
  
  switch (apiName) {
    case 'getTemplates':
      return copywritingController.getTemplates(req, res, next);
    
    case 'generateCopy':
      return copywritingController.generateCopy(req, res, next);
    
    case 'analyzeCopy':
      return copywritingController.analyzeCopy(req, res, next);
    
    case 'getHistory':
      return copywritingController.getCopyHistory(req, res, next);
    
    default:
      return next(new AppError(`未找到文案生成插件API: ${apiName}`, 404));
  }
};

/**
 * 处理翻译插件请求
 */
const handleTranslatorRequest = (apiName, req, res, next) => {
  const translateController = require('./translate.controller');
  
  switch (apiName) {
    case 'getLanguages':
      return translateController.getLanguages(req, res, next);
    
    case 'translateText':
      return translateController.translateText(req, res, next);
    
    case 'translateFile':
      return translateController.translateFile(req, res, next);
    
    case 'getHistory':
      return translateController.getHistory(req, res, next);
    
    case 'exportTranslation':
      return translateController.exportTranslation(req, res, next);
    
    default:
      return next(new AppError(`未找到翻译插件API: ${apiName}`, 404));
  }
}; 