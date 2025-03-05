/**
 * 自定义应用错误类
 * 用于创建可操作的错误，便于错误处理中间件区分操作错误和程序错误
 */
class AppError extends Error {
  /**
   * 创建一个新的应用错误
   * @param {string} message - 错误消息
   * @param {number} statusCode - HTTP状态码
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // 标记为操作错误，便于错误处理

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError; 