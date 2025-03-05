import { PluginConfig } from '@lobehub/chat-plugin-sdk';

/**
 * i18N翻译插件配置
 */
export const pluginConfig: PluginConfig = {
  identifier: 'i18n-translator',
  version: '1.0.0',
  api: [
    {
      name: 'translateText',
      description: '翻译文本',
      url: '/api/v1/translate/text',
      method: 'POST',
    },
    {
      name: 'translateFile',
      description: '翻译文件',
      url: '/api/v1/translate/file',
      method: 'POST',
    },
    {
      name: 'getLanguages',
      description: '获取支持的语言列表',
      url: '/api/v1/translate/languages',
      method: 'GET',
    },
    {
      name: 'getHistory',
      description: '获取翻译历史',
      url: '/api/v1/translate/history',
      method: 'GET',
    },
    {
      name: 'exportTranslation',
      description: '导出翻译结果',
      url: '/api/v1/translate/export',
      method: 'POST',
    },
  ],
  ui: {
    url: 'http://localhost:3000/plugins/i18n-translator',
    height: 600,
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
      defaultSourceLanguage: {
        title: '默认源语言',
        type: 'string',
        default: 'auto',
      },
      defaultTargetLanguage: {
        title: '默认目标语言',
        type: 'string',
        default: 'en',
      },
    },
    required: ['apiModel'],
  },
  meta: {
    title: 'i18N翻译',
    description: '多语言翻译工具，支持文本和文件翻译',
    avatar: '🌐',
    tags: ['翻译', '多语言', 'i18n'],
    author: 'AI工具箱',
  },
}; 