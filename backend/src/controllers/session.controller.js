/**
 * 会话控制器
 */

const Session = require('../models/session.model');
const Message = require('../models/message.model');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * 获取用户的所有会话
 */
exports.getSessions = asyncHandler(async (req, res, next) => {
  const { archived, pinned, favorite } = req.query;
  
  // 构建查询条件
  const query = { user: req.user.id };
  
  // 根据查询参数添加过滤条件
  if (archived !== undefined) query.archived = archived === 'true';
  if (pinned !== undefined) query.pinned = pinned === 'true';
  if (favorite !== undefined) query.favorite = favorite === 'true';
  
  // 查询会话并按创建时间降序排序
  const sessions = await Session.find(query).sort({ createdAt: -1 });
  
  res.status(200).json({
    status: 'success',
    results: sessions.length,
    data: {
      sessions,
    },
  });
});

/**
 * 创建新会话
 */
exports.createSession = asyncHandler(async (req, res, next) => {
  const { topic, agentId, meta } = req.body;
  
  // 创建新会话
  const newSession = await Session.create({
    user: req.user.id,
    topic: topic || '新会话',
    agentId: agentId || null,
    meta: meta || {},
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      session: newSession,
    },
  });
});

/**
 * 获取单个会话
 */
exports.getSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('未找到该会话或无权访问', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  });
});

/**
 * 更新会话
 */
exports.updateSession = asyncHandler(async (req, res, next) => {
  const { topic, favorite, pinned, archived, meta, agentId } = req.body;
  
  // 查找并更新会话
  const session = await Session.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.id,
    },
    {
      ...(topic !== undefined && { topic }),
      ...(favorite !== undefined && { favorite }),
      ...(pinned !== undefined && { pinned }),
      ...(archived !== undefined && { archived }),
      ...(meta !== undefined && { meta }),
      ...(agentId !== undefined && { agentId }),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  
  if (!session) {
    return next(new AppError('未找到该会话或无权访问', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  });
});

/**
 * 删除会话
 */
exports.deleteSession = asyncHandler(async (req, res, next) => {
  // 查找会话
  const session = await Session.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('未找到该会话或无权访问', 404));
  }
  
  // 删除会话及其所有消息
  await Promise.all([
    Session.findByIdAndDelete(req.params.id),
    Message.deleteMany({ sessionId: req.params.id }),
  ]);
  
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

/**
 * 清空会话消息
 */
exports.clearSessionMessages = asyncHandler(async (req, res, next) => {
  // 查找会话
  const session = await Session.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('未找到该会话或无权访问', 404));
  }
  
  // 删除会话的所有消息
  await Message.deleteMany({ sessionId: req.params.id });
  
  // 更新会话的最后消息信息
  await Session.findByIdAndUpdate(req.params.id, {
    lastMessageId: null,
    lastMessageCreatedAt: null,
  });
  
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

/**
 * 获取会话消息
 */
exports.getSessionMessages = asyncHandler(async (req, res, next) => {
  const { limit = 50, before } = req.query;
  
  // 查找会话
  const session = await Session.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('未找到该会话或无权访问', 404));
  }
  
  // 构建查询条件
  const query = { sessionId: req.params.id };
  
  // 如果提供了before参数，则查询在此之前的消息
  if (before) {
    const beforeMessage = await Message.findById(before);
    if (beforeMessage) {
      query.createdAt = { $lt: beforeMessage.createdAt };
    }
  }
  
  // 查询消息并按创建时间降序排序，限制返回数量
  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10));
  
  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages: messages.reverse(), // 返回时按时间升序排列
    },
  });
}); 