/**
 * 验证工具函数
 */

/**
 * 验证URL是否有效
 * @param {string} url - 要验证的URL
 * @returns {boolean} 是否有效
 */
exports.isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 验证电子邮件是否有效
 * @param {string} email - 要验证的电子邮件
 * @returns {boolean} 是否有效
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证密码强度
 * @param {string} password - 要验证的密码
 * @returns {boolean} 是否足够强
 */
exports.isStrongPassword = (password) => {
  // 至少8个字符，包含大小写字母、数字和特殊字符
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * 验证对象ID是否有效
 * @param {string} id - 要验证的ID
 * @returns {boolean} 是否有效
 */
exports.isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * 验证手机号码是否有效（中国大陆）
 * @param {string} phone - 要验证的手机号码
 * @returns {boolean} 是否有效
 */
exports.isValidChinesePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证字符串是否为有效的JSON
 * @param {string} str - 要验证的字符串
 * @returns {boolean} 是否为有效的JSON
 */
exports.isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}; 