/**
 * 插件控制器
 */

const Plugin = require('../models/plugin.model');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { isValidUrl } = require('../utils/validators');
const axios = require('axios');

/**
 * 获取用户安装的所有插件
 */
exports.getInstalledPlugins = asyncHandler(async (req, res) => {
  const plugins = await Plugin.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: plugins.length,
    data: {
      plugins,
    },
  });
});

/**
 * 安装插件
 */
exports.installPlugin = asyncHandler(async (req, res, next) => {
  const { identifier, manifest, meta, customParams } = req.body;

  if (!identifier || !manifest) {
    return next(new AppError('请提供插件标识符和清单', 400));
  }

  // 检查插件是否已存在
  const existingPlugin = await Plugin.findOne({
    identifier,
    user: req.user.id,
  });

  if (existingPlugin) {
    // 更新现有插件
    existingPlugin.manifest = manifest;
    existingPlugin.meta = meta || existingPlugin.meta;
    existingPlugin.customParams = customParams || existingPlugin.customParams;
    existingPlugin.updatedAt = Date.now();

    await existingPlugin.save();

    return res.status(200).json({
      status: 'success',
      data: {
        plugin: existingPlugin,
      },
    });
  }

  // 创建新插件
  const plugin = await Plugin.create({
    identifier,
    manifest,
    meta: meta || {},
    customParams: customParams || null,
    user: req.user.id,
    type: customParams ? 'customPlugin' : 'plugin',
  });

  res.status(201).json({
    status: 'success',
    data: {
      plugin,
    },
  });
});

/**
 * 创建自定义插件
 */
exports.createCustomPlugin = asyncHandler(async (req, res, next) => {
  const { identifier, manifest, meta, customParams } = req.body;

  if (!identifier || !manifest || !customParams) {
    return next(new AppError('请提供完整的自定义插件信息', 400));
  }

  // 检查插件是否已存在
  const existingPlugin = await Plugin.findOne({
    identifier,
    user: req.user.id,
  });

  if (existingPlugin) {
    return next(new AppError('插件标识符已存在', 400));
  }

  // 创建自定义插件
  const plugin = await Plugin.create({
    identifier,
    manifest,
    meta: meta || {},
    customParams,
    user: req.user.id,
    type: 'customPlugin',
  });

  res.status(201).json({
    status: 'success',
    data: {
      plugin,
    },
  });
});

/**
 * 更新插件
 */
exports.updatePlugin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { manifest, settings, meta, customParams } = req.body;

  const plugin = await Plugin.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!plugin) {
    return next(new AppError('未找到插件', 404));
  }

  // 更新插件字段
  if (manifest) plugin.manifest = manifest;
  if (settings) plugin.settings = settings;
  if (meta) plugin.meta = meta;
  if (customParams) plugin.customParams = customParams;
  plugin.updatedAt = Date.now();

  await plugin.save();

  res.status(200).json({
    status: 'success',
    data: {
      plugin,
    },
  });
});

/**
 * 更新插件设置
 */
exports.updatePluginSettings = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { settings } = req.body;

  if (!settings) {
    return next(new AppError('请提供插件设置', 400));
  }

  const plugin = await Plugin.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!plugin) {
    return next(new AppError('未找到插件', 404));
  }

  plugin.settings = settings;
  plugin.updatedAt = Date.now();

  await plugin.save();

  res.status(200).json({
    status: 'success',
    data: {
      plugin,
    },
  });
});

/**
 * 更新插件清单
 */
exports.updatePluginManifest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { manifest } = req.body;

  if (!manifest) {
    return next(new AppError('请提供插件清单', 400));
  }

  const plugin = await Plugin.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!plugin) {
    return next(new AppError('未找到插件', 404));
  }

  plugin.manifest = manifest;
  plugin.updatedAt = Date.now();

  await plugin.save();

  res.status(200).json({
    status: 'success',
    data: {
      plugin,
    },
  });
});

/**
 * 卸载插件
 */
exports.uninstallPlugin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const plugin = await Plugin.findOneAndDelete({
    _id: id,
    user: req.user.id,
  });

  if (!plugin) {
    return next(new AppError('未找到插件', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * 删除所有插件
 */
exports.removeAllPlugins = asyncHandler(async (req, res) => {
  await Plugin.deleteMany({ user: req.user.id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * 从URL获取插件清单
 */
exports.getPluginManifestFromUrl = asyncHandler(async (req, res, next) => {
  const { url } = req.query;

  if (!url || !isValidUrl(url)) {
    return next(new AppError('请提供有效的URL', 400));
  }

  try {
    const response = await axios.get(url);
    const manifest = response.data;

    if (!manifest || !manifest.identifier) {
      return next(new AppError('无效的插件清单', 400));
    }

    res.status(200).json({
      status: 'success',
      data: {
        manifest,
      },
    });
  } catch (error) {
    return next(new AppError(`获取插件清单失败: ${error.message}`, 400));
  }
});

/**
 * 获取插件商店列表
 */
exports.getPluginStore = asyncHandler(async (req, res) => {
  // 这里可以实现从外部API获取插件商店数据
  // 或者从本地数据库获取预设的插件列表
  const pluginStore = [
    {
      identifier: 'ai-prototype',
      name: 'AI原型生成',
      description: '快速生成UI/UX原型设计，支持多种风格和导出格式',
      author: 'AI工具箱',
      avatar: '🎨',
      homepage: 'https://github.com/ai-toolkit/ai-prototype',
      version: '1.0.0',
      tags: ['设计', '原型', 'UI/UX'],
      meta: {
        title: 'AI原型生成',
        description: '快速生成UI/UX原型设计，支持多种风格和导出格式',
        avatar: '🎨',
      },
    },
    {
      identifier: 'ai-copywriting',
      name: 'AI文案生成',
      description: '智能生成营销文案、产品描述、社交媒体内容等',
      author: 'AI工具箱',
      avatar: '✍️',
      homepage: 'https://github.com/ai-toolkit/ai-copywriting',
      version: '1.0.0',
      tags: ['文案', '营销', '内容创作'],
      meta: {
        title: 'AI文案生成',
        description: '智能生成营销文案、产品描述、社交媒体内容等',
        avatar: '✍️',
      },
    },
    {
      identifier: 'i18n-translator',
      name: 'i18N翻译',
      description: '多语言翻译工具，支持文本和文件翻译',
      author: 'AI工具箱',
      avatar: '🌐',
      homepage: 'https://github.com/ai-toolkit/i18n-translator',
      version: '1.0.0',
      tags: ['翻译', '多语言', 'i18n'],
      meta: {
        title: 'i18N翻译',
        description: '多语言翻译工具，支持文本和文件翻译',
        avatar: '🌐',
      },
    },
  ];

  res.status(200).json({
    status: 'success',
    results: pluginStore.length,
    data: {
      plugins: pluginStore,
    },
  });
}); 