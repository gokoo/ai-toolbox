/**
 * 应用配置
 */

const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

module.exports = {
  // 服务器配置
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  database: {
    URI: process.env.DATABASE_URI || 'mongodb://localhost:27017/ai-toolbox',
    PASSWORD: process.env.DATABASE_PASSWORD,
  },
  
  // JWT配置
  jwt: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '90d',
    COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || 90,
  },
  
  // 跨域配置
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // 上传配置
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  
  // 限流配置
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 每个IP 100次请求
  },
  
  // 日志配置
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // OpenAI配置
  openai: {
    API_KEY: process.env.OPENAI_API_KEY,
    API_MODEL: process.env.OPENAI_API_MODEL || 'gpt-3.5-turbo',
  },
  
  // 阿里云配置
  aliyun: {
    ACCESS_KEY_ID: process.env.ALIYUN_ACCESS_KEY_ID,
    ACCESS_KEY_SECRET: process.env.ALIYUN_ACCESS_KEY_SECRET,
    OSS_BUCKET: process.env.ALIYUN_OSS_BUCKET,
    OSS_REGION: process.env.ALIYUN_OSS_REGION,
  },
  
  // 腾讯云配置
  tencent: {
    SECRET_ID: process.env.TENCENT_SECRET_ID,
    SECRET_KEY: process.env.TENCENT_SECRET_KEY,
    COS_BUCKET: process.env.TENCENT_COS_BUCKET,
    COS_REGION: process.env.TENCENT_COS_REGION,
  },
}; 