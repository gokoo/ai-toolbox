/**
 * 翻译控制器
 */

const AppError = require('../utils/appError');

// 模拟支持的语言列表
const supportedLanguages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: '英语' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'es', name: '西班牙语' },
  { code: 'ru', name: '俄语' },
  { code: 'it', name: '意大利语' },
  { code: 'pt', name: '葡萄牙语' }
];

// 模拟翻译历史数据
let translationHistory = [];

/**
 * 获取支持的语言列表
 */
exports.getLanguages = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      languages: supportedLanguages
    }
  });
};

/**
 * 翻译文本
 */
exports.translateText = async (req, res, next) => {
  try {
    const { text, sourceLanguage, targetLanguage, model } = req.body;

    // 验证请求数据
    if (!text) {
      return next(new AppError('请提供要翻译的文本', 400));
    }

    if (!targetLanguage) {
      return next(new AppError('请提供目标语言', 400));
    }

    // 检查语言是否支持
    const isTargetSupported = supportedLanguages.some(lang => lang.code === targetLanguage);
    if (!isTargetSupported) {
      return next(new AppError('不支持的目标语言', 400));
    }

    if (sourceLanguage) {
      const isSourceSupported = supportedLanguages.some(lang => lang.code === sourceLanguage);
      if (!isSourceSupported) {
        return next(new AppError('不支持的源语言', 400));
      }
    }

    // 模拟翻译过程
    // 在实际应用中，这里会调用AI服务API进行翻译
    const translatedText = `[${targetLanguage}] ${text}`;
    
    // 创建翻译历史记录
    const translation = {
      id: Date.now().toString(),
      userId: req.user._id,
      text,
      translatedText,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
      model: model || 'default',
      createdAt: new Date().toISOString()
    };
    
    translationHistory.push(translation);

    res.status(200).json({
      status: 'success',
      data: {
        translation
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 翻译文件
 */
exports.translateFile = async (req, res, next) => {
  try {
    // 在实际应用中，这里会处理文件上传和翻译
    // 目前仅返回模拟数据
    res.status(200).json({
      status: 'success',
      message: '文件翻译功能尚未实现',
      data: {
        jobId: 'file-translation-' + Date.now()
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 获取翻译历史
 */
exports.getHistory = async (req, res, next) => {
  try {
    // 过滤当前用户的翻译历史
    const userHistory = translationHistory.filter(
      item => item.userId.toString() === req.user._id.toString()
    );

    res.status(200).json({
      status: 'success',
      results: userHistory.length,
      data: {
        translations: userHistory
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 获取特定翻译历史
 */
exports.getHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查找特定ID的翻译历史
    const translation = translationHistory.find(
      item => item.id === id && item.userId.toString() === req.user._id.toString()
    );

    if (!translation) {
      return next(new AppError('未找到该ID的翻译记录', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        translation
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 删除翻译历史
 */
exports.deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查找特定ID的翻译历史索引
    const index = translationHistory.findIndex(
      item => item.id === id && item.userId.toString() === req.user._id.toString()
    );

    if (index === -1) {
      return next(new AppError('未找到该ID的翻译记录', 404));
    }

    // 删除该记录
    translationHistory.splice(index, 1);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 导出翻译结果
 */
exports.exportTranslation = async (req, res, next) => {
  try {
    // 在实际应用中，这里会处理导出逻辑
    // 目前仅返回模拟数据
    res.status(200).json({
      status: 'success',
      message: '导出功能尚未实现',
      data: {
        exportUrl: '/exports/translation-' + Date.now() + '.json'
      }
    });
  } catch (err) {
    next(err);
  }
}; 