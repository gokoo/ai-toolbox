/**
 * 插件模型
 */

const mongoose = require('mongoose');

const pluginSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: [true, '插件标识符是必需的'],
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '插件必须属于一个用户'],
    },
    type: {
      type: String,
      enum: ['plugin', 'customPlugin'],
      default: 'plugin',
    },
    manifest: {
      type: Object,
      required: [true, '插件清单是必需的'],
    },
    settings: {
      type: Object,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: Object,
      default: {},
    },
    customParams: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 索引优化查询性能
pluginSchema.index({ user: 1, identifier: 1 }, { unique: true });
pluginSchema.index({ user: 1, createdAt: -1 });

const Plugin = mongoose.model('Plugin', pluginSchema);

module.exports = Plugin; 