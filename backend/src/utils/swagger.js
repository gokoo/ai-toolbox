/**
 * Swagger API文档配置
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { version } = require('../../package.json');

// Swagger定义
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI工具箱 API',
      version,
      description: '基于Lobe Chat框架的AI工具集合API文档',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API支持',
        url: 'https://github.com/yourusername/ai-toolbox',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API服务器',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: '发生错误',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
            name: {
              type: 'string',
              example: '张三',
            },
            email: {
              type: 'string',
              example: 'zhangsan@example.com',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
            },
          },
        },
        TranslationRequest: {
          type: 'object',
          required: ['text', 'targetLanguage'],
          properties: {
            text: {
              type: 'string',
              example: '你好，世界',
            },
            sourceLanguage: {
              type: 'string',
              example: 'zh-CN',
            },
            targetLanguage: {
              type: 'string',
              example: 'en',
            },
          },
        },
        PrototypeRequest: {
          type: 'object',
          required: ['templateId', 'description'],
          properties: {
            templateId: {
              type: 'string',
              example: 'mobile-app',
            },
            description: {
              type: 'string',
              example: '一个简洁的任务管理应用界面',
            },
            elements: {
              type: 'string',
              example: '任务列表、添加按钮、筛选选项',
            },
            style: {
              type: 'string',
              example: '扁平化设计，蓝色主题',
            },
          },
        },
        CopywritingRequest: {
          type: 'object',
          required: ['templateId', 'product'],
          properties: {
            templateId: {
              type: 'string',
              example: 'social-media',
            },
            product: {
              type: 'string',
              example: 'AI智能助手',
            },
            audience: {
              type: 'string',
              example: '25-40岁的职场人士',
            },
            tone: {
              type: 'string',
              example: '专业但友好',
            },
            keywords: {
              type: 'string',
              example: '效率,智能,便捷',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // 路由文件路径
};

const specs = swaggerJsdoc(options);

/**
 * 设置Swagger文档
 * @param {Express} app Express应用实例
 */
const setupSwagger = (app) => {
  // Swagger文档路由
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AI工具箱 API文档',
  }));

  // 提供OpenAPI规范JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = {
  setupSwagger,
}; 