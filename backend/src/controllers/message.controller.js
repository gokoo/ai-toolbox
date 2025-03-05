/**
 * 消息控制器
 */

const Message = require('../models/message.model');
const Session = require('../models/session.model');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * 创建新消息
 */
exports.createMessage = asyncHandler(async (req, res, next) => {
  const { sessionId, role, content, parentId, quotaId, plugin, files, tools } = req.body;
  
  // 检查会话是否存在且属于当前用户
  const session = await Session.findOne({
    _id: sessionId,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('未找到会话', 404));
  }
  
  // 创建消息
  const message = await Message.create({
    sessionId,
    role,
    content,
    parentId: parentId || null,
    quotaId: quotaId || null,
    plugin: plugin || null,
    files: files || [],
    tools: tools || [],
  });
  
  // 更新会话的最后消息信息
  session.lastMessageId = message._id;
  session.lastMessageCreatedAt = message.createdAt;
  await session.save();
  
  res.status(201).json({
    status: 'success',
    data: {
      message,
    },
  });
});

/**
 * 获取特定消息
 */
exports.getMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // 查询消息
  const message = await Message.findById(id);
  
  if (!message) {
    return next(new AppError('未找到消息', 404));
  }
  
  // 检查消息所属的会话是否属于当前用户
  const session = await Session.findOne({
    _id: message.sessionId,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('无权访问此消息', 403));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
});

/**
 * 更新消息
 */
exports.updateMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { content, plugin, error, tools } = req.body;
  
  // 查询消息
  const message = await Message.findById(id);
  
  if (!message) {
    return next(new AppError('未找到消息', 404));
  }
  
  // 检查消息所属的会话是否属于当前用户
  const session = await Session.findOne({
    _id: message.sessionId,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('无权修改此消息', 403));
  }
  
  // 更新消息字段
  if (content !== undefined) message.content = content;
  if (plugin !== undefined) message.plugin = plugin;
  if (error !== undefined) message.error = error;
  
  // 更新工具状态
  if (tools && tools.length > 0) {
    tools.forEach(tool => {
      const existingToolIndex = message.tools.findIndex(t => t.id === tool.id);
      if (existingToolIndex >= 0) {
        // 更新现有工具
        message.tools[existingToolIndex] = {
          ...message.tools[existingToolIndex],
          ...tool,
          updatedAt: Date.now(),
        };
      } else {
        // 添加新工具
        message.tools.push({
          ...tool,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    });
  }
  
  // 保存更新
  await message.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
});

/**
 * 删除消息
 */
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // 查询消息
  const message = await Message.findById(id);
  
  if (!message) {
    return next(new AppError('未找到消息', 404));
  }
  
  // 检查消息所属的会话是否属于当前用户
  const session = await Session.findOne({
    _id: message.sessionId,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('无权删除此消息', 403));
  }
  
  // 删除消息
  await message.deleteOne();
  
  // 如果删除的是最后一条消息，更新会话的最后消息信息
  if (session.lastMessageId && session.lastMessageId.toString() === id) {
    // 查找新的最后一条消息
    const lastMessage = await Message.findOne({ sessionId: session._id })
      .sort({ createdAt: -1 });
    
    if (lastMessage) {
      session.lastMessageId = lastMessage._id;
      session.lastMessageCreatedAt = lastMessage.createdAt;
    } else {
      session.lastMessageId = null;
      session.lastMessageCreatedAt = null;
    }
    
    await session.save();
  }
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * 更新工具状态
 */
exports.updateToolState = asyncHandler(async (req, res, next) => {
  const { id, toolId } = req.params;
  const { state, response, error } = req.body;
  
  // 查询消息
  const message = await Message.findById(id);
  
  if (!message) {
    return next(new AppError('未找到消息', 404));
  }
  
  // 检查消息所属的会话是否属于当前用户
  const session = await Session.findOne({
    _id: message.sessionId,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('无权修改此消息', 403));
  }
  
  // 查找工具
  const toolIndex = message.tools.findIndex(tool => tool.id === toolId);
  
  if (toolIndex === -1) {
    return next(new AppError('未找到工具', 404));
  }
  
  // 更新工具状态
  if (state) message.tools[toolIndex].state = state;
  if (response) message.tools[toolIndex].response = response;
  if (error) message.tools[toolIndex].error = error;
  message.tools[toolIndex].updatedAt = Date.now();
  
  // 保存更新
  await message.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      tool: message.tools[toolIndex],
    },
  });
}); 