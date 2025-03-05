import { PluginConfig } from '@lobehub/chat-plugin-sdk';

/**
 * AI文案生成插件配置
 */
export const pluginConfig: PluginConfig = {
  identifier: 'ai-copywriting',
  version: '1.0.0',
  api: [
    {
      name: 'generateCopy',
      description: '生成文案内容',
      url: '/api/v1/copywriting/generate',
      method: 'POST',
    },
    {
      name: 'getTemplates',
      description: '获取文案模板列表',
      url: '/api/v1/copywriting/templates',
      method: 'GET',
    },
    {
      name: 'saveCopy',
      description: '保存文案内容',
      url: '/api/v1/copywriting/save',
      method: 'POST',
    },
    {
      name: 'getHistory',
      description: '获取历史文案',
      url: '/api/v1/copywriting/history',
      method: 'GET',
    },
    {
      name: 'analyzeCopy',
      description: '分析文案效果',
      url: '/api/v1/copywriting/analyze',
      method: 'POST',
    },
  ],
  ui: {
    url: 'http://localhost:3000/plugins/ai-copywriting',
    height: 650,
  },
  settings: {
    properties: {
      apiModel: {
        title: 'AI模型',
        type: 'string',
        enum: ['openai', 'azure', 'baidu', 'tencent'],
        default: 'openai',
      },
      apiKey: {
        title: 'API密钥',
        type: 'string',
        format: 'password',
      },
      defaultTone: {
        title: '默认语调',
        type: 'string',
        enum: ['专业', '友好', '幽默', '正式', '创意'],
        default: '专业',
      },
      defaultLength: {
        title: '默认长度',
        type: 'string',
        enum: ['短', '中', '长'],
        default: '中',
      },
      defaultLanguage: {
        title: '默认语言',
        type: 'string',
        enum: ['中文', '英文', '日文', '韩文', '法文', '德文'],
        default: '中文',
      },
    },
    required: ['apiModel'],
  },
  meta: {
    title: 'AI文案生成',
    description: '智能生成营销文案、产品描述、社交媒体内容等',
    avatar: '✍️',
    tags: ['文案', '营销', '内容创作'],
    author: 'AI工具箱',
  },
}; 