/**
 * 异步处理器包装函数
 * 用于捕获异步路由处理器中的错误，避免使用 try-catch 块
 * @param {Function} fn 异步函数
 * @returns {Function} Express 中间件函数
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler; 