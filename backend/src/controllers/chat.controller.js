/**
 * 聊天控制器
 */

const Session = require('../models/session.model');
const Message = require('../models/message.model');
const Plugin = require('../models/plugin.model');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../config');

/**
 * 发送聊天消息
 */
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { sessionId, content, files, parentId, quotaId } = req.body;
  
  // 检查会话是否存在且属于当前用户
  const session = await Session.findOne({
    _id: sessionId,
    user: req.user.id,
  });
  
  if (!session) {
    return next(new AppError('未找到会话', 404));
  }
  
  // 创建用户消息
  const userMessage = await Message.create({
    sessionId,
    role: 'user',
    content,
    parentId: parentId || null,
    quotaId: quotaId || null,
    files: files || [],
  });
  
  // 更新会话的最后消息信息
  session.lastMessageId = userMessage._id;
  session.lastMessageCreatedAt = userMessage.createdAt;
  await session.save();
  
  // 创建助手消息（初始状态）
  const assistantMessage = await Message.create({
    sessionId,
    role: 'assistant',
    content: '正在思考...',
    parentId: userMessage._id,
  });
  
  // 异步处理AI响应
  processAIResponse(req.user, session, userMessage, assistantMessage).catch(error => {
    console.error('处理AI响应时出错:', error);
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      userMessage,
      assistantMessage,
    },
  });
});

/**
 * 处理AI响应
 */
const processAIResponse = async (user, session, userMessage, assistantMessage) => {
  try {
    // 获取会话历史消息
    const history = await Message.find({
      sessionId: session._id,
      _id: { $ne: assistantMessage._id }, // 排除当前的助手消息
    })
      .sort({ createdAt: 1 })
      .limit(20); // 限制历史消息数量
    
    // 构建消息历史
    const messages = history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
    
    // 添加系统消息
    messages.unshift({
      role: 'system',
      content: '你是一个有用的AI助手，能够回答用户的问题并提供帮助。',
    });
    
    // 检查是否需要使用插件
    const pluginMatch = userMessage.content.match(/使用插件\s*[:：]\s*(\S+)/i);
    if (pluginMatch) {
      const pluginIdentifier = pluginMatch[1];
      return await processPluginRequest(user, session, userMessage, assistantMessage, pluginIdentifier);
    }
    
    // 调用AI服务
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: config.openai.API_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openai.API_KEY}`,
        },
      }
    );
    
    // 更新助手消息
    assistantMessage.content = response.data.choices[0].message.content;
    await assistantMessage.save();
    
    // 更新会话的最后消息信息
    session.lastMessageId = assistantMessage._id;
    session.lastMessageCreatedAt = assistantMessage.createdAt;
    await session.save();
  } catch (error) {
    // 更新助手消息为错误状态
    assistantMessage.content = '抱歉，处理您的请求时出错了。';
    assistantMessage.error = {
      message: error.message,
      code: error.response?.status || 500,
    };
    await assistantMessage.save();
  }
};

/**
 * 处理插件请求
 */
const processPluginRequest = async (user, session, userMessage, assistantMessage, pluginIdentifier) => {
  try {
    // 查找插件
    const plugin = await Plugin.findOne({
      identifier: pluginIdentifier,
      user: user.id,
    });
    
    if (!plugin) {
      assistantMessage.content = `抱歉，未找到插件: ${pluginIdentifier}`;
      await assistantMessage.save();
      return;
    }
    
    // 创建工具ID
    const toolId = uuidv4();
    
    // 更新助手消息，添加工具调用
    assistantMessage.content = `我正在使用 ${plugin.manifest.meta?.title || plugin.identifier} 插件...`;
    assistantMessage.tools = [{
      id: toolId,
      type: plugin.type,
      name: plugin.manifest.meta?.title || plugin.identifier,
      pluginId: plugin._id,
      apiName: 'default', // 默认API名称
      arguments: {
        query: userMessage.content,
      },
      state: 'running',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }];
    await assistantMessage.save();
    
    // 模拟插件处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 更新工具状态为成功
    assistantMessage.tools[0].state = 'success';
    assistantMessage.tools[0].response = {
      result: `这是来自 ${plugin.manifest.meta?.title || plugin.identifier} 插件的模拟响应。在实际实现中，这里将包含插件的真实响应数据。`,
    };
    assistantMessage.tools[0].updatedAt = Date.now();
    
    // 更新助手消息内容
    assistantMessage.content = `我使用了 ${plugin.manifest.meta?.title || plugin.identifier} 插件，结果如下：\n\n${assistantMessage.tools[0].response.result}`;
    
    await assistantMessage.save();
    
    // 更新会话的最后消息信息
    session.lastMessageId = assistantMessage._id;
    session.lastMessageCreatedAt = assistantMessage.createdAt;
    await session.save();
  } catch (error) {
    // 更新助手消息为错误状态
    if (assistantMessage.tools && assistantMessage.tools.length > 0) {
      assistantMessage.tools[0].state = 'error';
      assistantMessage.tools[0].error = {
        message: error.message,
        code: error.response?.status || 500,
      };
      assistantMessage.tools[0].updatedAt = Date.now();
    }
    
    assistantMessage.content = `抱歉，使用插件 ${pluginIdentifier} 时出错: ${error.message}`;
    assistantMessage.error = {
      message: error.message,
      code: error.response?.status || 500,
    };
    
    await assistantMessage.save();
  }
};

/**
 * 重新生成消息
 */
exports.regenerateMessage = asyncHandler(async (req, res, next) => {
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
  
  // 检查是否是助手消息
  if (message.role !== 'assistant') {
    return next(new AppError('只能重新生成助手消息', 400));
  }
  
  // 查找父消息（用户消息）
  const parentMessage = await Message.findById(message.parentId);
  
  if (!parentMessage || parentMessage.role !== 'user') {
    return next(new AppError('未找到对应的用户消息', 404));
  }
  
  // 重置助手消息
  message.content = '正在重新生成...';
  message.error = null;
  message.tools = [];
  await message.save();
  
  // 异步处理AI响应
  processAIResponse(req.user, session, parentMessage, message).catch(error => {
    console.error('处理AI响应时出错:', error);
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
});

/**
 * 使用插件
 */
exports.usePlugin = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const { pluginId, apiName, arguments: args } = req.body;
  
  // 查询消息
  const message = await Message.findById(messageId);
  
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
  
  // 查找插件
  const plugin = await Plugin.findOne({
    _id: pluginId,
    user: req.user.id,
  });
  
  if (!plugin) {
    return next(new AppError('未找到插件', 404));
  }
  
  // 创建工具ID
  const toolId = uuidv4();
  
  // 添加工具调用
  const tool = {
    id: toolId,
    type: plugin.type,
    name: plugin.manifest.meta?.title || plugin.identifier,
    pluginId: plugin._id,
    apiName: apiName || 'default',
    arguments: args || {},
    state: 'running',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  message.tools = message.tools || [];
  message.tools.push(tool);
  await message.save();
  
  // 异步处理插件请求
  processPluginCall(req.user, session, message, tool).catch(error => {
    console.error('处理插件调用时出错:', error);
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      tool,
    },
  });
});

/**
 * 处理插件调用
 */
const processPluginCall = async (user, session, message, tool) => {
  try {
    // 查找插件
    const plugin = await Plugin.findById(tool.pluginId);
    
    if (!plugin) {
      throw new Error('未找到插件');
    }
    
    // 模拟插件处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 更新工具状态为成功
    const toolIndex = message.tools.findIndex(t => t.id === tool.id);
    if (toolIndex === -1) {
      throw new Error('未找到工具');
    }
    
    message.tools[toolIndex].state = 'success';
    message.tools[toolIndex].response = {
      result: `这是来自 ${plugin.manifest.meta?.title || plugin.identifier} 插件的模拟响应。在实际实现中，这里将包含插件的真实响应数据。`,
    };
    message.tools[toolIndex].updatedAt = Date.now();
    
    await message.save();
  } catch (error) {
    // 更新工具状态为错误
    const toolIndex = message.tools.findIndex(t => t.id === tool.id);
    if (toolIndex !== -1) {
      message.tools[toolIndex].state = 'error';
      message.tools[toolIndex].error = {
        message: error.message,
        code: error.response?.status || 500,
      };
      message.tools[toolIndex].updatedAt = Date.now();
      
      await message.save();
    }
  }
}; 