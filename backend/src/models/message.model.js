/**
 * 消息模型
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Session',
      required: [true, '消息必须属于一个会话'],
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system', 'tool'],
      required: [true, '消息角色是必需的'],
    },
    content: {
      type: String,
      required: [true, '消息内容是必需的'],
    },
    meta: {
      type: Object,
      default: {},
    },
    parentId: {
      type: String,
      default: null,
    },
    quotaId: {
      type: String,
      default: null,
    },
    pluginState: {
      type: Object,
      default: null,
    },
    plugin: {
      type: Object,
      default: null,
    },
    files: [
      {
        id: String,
        name: String,
        url: String,
        size: Number,
        type: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    error: {
      type: Object,
      default: null,
    },
    tools: [
      {
        id: String,
        type: String,
        name: String,
        pluginId: String,
        apiName: String,
        arguments: Object,
        response: Object,
        state: {
          type: String,
          enum: ['pending', 'running', 'success', 'error'],
          default: 'pending',
        },
        error: Object,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引优化查询性能
messageSchema.index({ sessionId: 1, createdAt: 1 });
messageSchema.index({ sessionId: 1, role: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 