/**
 * 数据库配置
 */

const mongoose = require('mongoose');
const config = require('./index');
const { logger } = require('../utils/logger');

/**
 * 连接数据库
 */
exports.connectDB = async () => {
  try {
    // 如果处于开发环境且没有配置MongoDB，使用内存模式
    if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URI) {
      logger.warn('未配置MongoDB连接，将使用内存模式运行');
      return;
    }

    const conn = await mongoose.connect(config.database.URI, {
      // 这些选项在Mongoose 6+中已经是默认值，不需要显式设置
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });

    logger.info(`MongoDB连接成功: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB连接失败: ${error.message}`);
    // 非开发环境下，数据库连接失败则退出进程
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1);
    } else {
      logger.warn('开发环境下继续运行，但数据库功能将不可用');
    }
  }
};

/**
 * 关闭数据库连接
 */
exports.closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB连接已关闭');
  } catch (error) {
    logger.error(`关闭MongoDB连接失败: ${error.message}`);
  }
}; 