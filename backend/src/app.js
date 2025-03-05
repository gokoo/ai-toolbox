/**
 * 应用入口文件
 */

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/error');
const config = require('./config');
const { setupSwagger } = require('./utils/swagger');
const { requestLogger, logger } = require('./utils/logger');
const path = require('path');

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app = express();

// 设置安全HTTP头
app.use(helmet());

// 开发环境下使用morgan日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 请求日志记录
app.use(requestLogger);

// 限制请求速率
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15分钟
  max: process.env.RATE_LIMIT_MAX || 100, // 每个IP 100次请求
  standardHeaders: true,
  legacyHeaders: false,
  message: '请求过于频繁，请稍后再试',
});
app.use('/api', limiter);

// 跨域设置
app.use(cors({
  origin: config.CORS_ORIGIN === '*' ? '*' : config.CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 解析请求体
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 数据清洗
app.use(mongoSanitize()); // 防止MongoDB操作符注入
app.use(xss()); // 防止XSS攻击

// 压缩响应
app.use(compression());

// 静态文件服务
app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// 设置API路由
app.use('/api/v1', routes);

// 设置Swagger文档
setupSwagger(app);

// 处理404错误
app.use(notFound);

// 全局错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();
    logger.info('数据库连接成功');

    // 启动服务器
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`服务器运行在 http://localhost:${PORT}`);
      logger.info(`API文档可在 http://localhost:${PORT}/api-docs 访问`);
    });
  } catch (error) {
    logger.error(`服务器启动失败: ${error.message}`);
    process.exit(1);
  }
};

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  logger.error('未捕获的异常! 正在关闭服务器...');
  logger.error(`错误名称: ${err.name}`);
  logger.error(`错误消息: ${err.message}`);
  logger.error(`错误堆栈: ${err.stack}`);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err) => {
  logger.error('未处理的Promise拒绝! 正在关闭服务器...');
  logger.error(`错误名称: ${err.name}`);
  logger.error(`错误消息: ${err.message}`);
  logger.error(`错误堆栈: ${err.stack}`);
  process.exit(1);
});

// 启动服务器
startServer();

module.exports = app; 