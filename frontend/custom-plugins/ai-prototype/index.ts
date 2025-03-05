import { PluginConfig } from '@lobehub/chat-plugin-sdk';

/**
 * AI原型生成插件配置
 */
export const pluginConfig: PluginConfig = {
  identifier: 'ai-prototype',
  version: '1.0.0',
  api: [
    {
      name: 'generatePrototype',
      description: '生成原型设计',
      url: '/api/v1/prototype/generate',
      method: 'POST',
    },
    {
      name: 'getTemplates',
      description: '获取原型模板列表',
      url: '/api/v1/prototype/templates',
      method: 'GET',
    },
    {
      name: 'savePrototype',
      description: '保存原型设计',
      url: '/api/v1/prototype/save',
      method: 'POST',
    },
    {
      name: 'getHistory',
      description: '获取历史原型设计',
      url: '/api/v1/prototype/history',
      method: 'GET',
    },
    {
      name: 'exportPrototype',
      description: '导出原型设计',
      url: '/api/v1/prototype/export',
      method: 'POST',
    },
  ],
  ui: {
    url: 'http://localhost:3000/plugins/ai-prototype',
    height: 700,
  },
  settings: {
    properties: {
      apiModel: {
        title: 'AI模型',
        type: 'string',
        enum: ['openai', 'midjourney', 'stable-diffusion'],
        default: 'openai',
      },
      apiKey: {
        title: 'API密钥',
        type: 'string',
        format: 'password',
      },
      defaultStyle: {
        title: '默认设计风格',
        type: 'string',
        enum: ['简约', '现代', '扁平化', '拟物化', '科技感'],
        default: '简约',
      },
      defaultFormat: {
        title: '默认导出格式',
        type: 'string',
        enum: ['PNG', 'JPG', 'SVG', 'PDF'],
        default: 'PNG',
      },
    },
    required: ['apiModel'],
  },
  meta: {
    title: 'AI原型生成',
    description: '快速生成UI/UX原型设计，支持多种风格和导出格式',
    avatar: '🎨',
    tags: ['设计', '原型', 'UI/UX'],
    author: 'AI工具箱',
  },
}; 