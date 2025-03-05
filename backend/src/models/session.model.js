/**
 * 会话模型
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '会话必须属于一个用户'],
    },
    topic: {
      type: String,
      default: '新会话',
    },
    meta: {
      type: Object,
      default: {},
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    agentId: {
      type: String,
      default: null,
    },
    lastMessageId: {
      type: String,
      default: null,
    },
    lastMessageCreatedAt: {
      type: Date,
      default: null,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引优化查询性能
sessionSchema.index({ user: 1, createdAt: -1 });
sessionSchema.index({ user: 1, favorite: 1 });
sessionSchema.index({ user: 1, pinned: 1 });
sessionSchema.index({ user: 1, archived: 1 });

// 虚拟属性：消息
sessionSchema.virtual('messages', {
  ref: 'Message',
  foreignField: 'sessionId',
  localField: '_id',
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session; 