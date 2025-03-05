/**
 * 用户模型
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '请提供姓名'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, '请提供邮箱'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, '请提供有效的邮箱']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    role: {
      type: String,
      enum: ['user', 'editor', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, '请提供密码'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, '请确认您的密码'],
      validate: {
        // 这个验证器只在CREATE和SAVE时工作
        validator: function(el) {
          return el === this.password;
        },
        message: '密码不匹配'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    apiKeys: [
      {
        name: {
          type: String,
          required: true,
        },
        provider: {
          type: String,
          required: true,
        },
        key: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      language: {
        type: String,
        default: 'zh-CN',
      },
      defaultModel: {
        type: String,
        default: 'openai',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * 保存前加密密码
 */
userSchema.pre('save', async function(next) {
  // 只有在密码被修改时才运行
  if (!this.isModified('password')) return next();

  // 加密密码
  this.password = await bcrypt.hash(this.password, 12);

  // 删除passwordConfirm字段
  this.passwordConfirm = undefined;
  next();
});

/**
 * 更新密码修改时间
 */
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * 只查询活跃用户
 */
userSchema.pre(/^find/, function(next) {
  // this指向当前查询
  this.find({ active: { $ne: false } });
  next();
});

/**
 * 检查密码是否正确
 * @param {string} candidatePassword - 候选密码
 * @param {string} userPassword - 用户密码
 * @returns {Promise<boolean>} 是否匹配
 */
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * 检查用户是否在令牌签发后更改了密码
 * @param {number} JWTTimestamp - JWT签发时间
 * @returns {boolean} 是否更改了密码
 */
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // 默认返回false
  return false;
};

/**
 * 创建密码重置令牌
 * @returns {string} 重置令牌
 */
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 令牌10分钟后过期
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 