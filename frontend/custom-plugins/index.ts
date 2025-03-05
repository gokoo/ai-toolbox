import { pluginConfig as i18nTranslator } from './i18n-translator';
import { pluginConfig as aiPrototype } from './ai-prototype';
import { pluginConfig as aiCopywriting } from './ai-copywriting';

/**
 * 导出所有自定义插件配置
 */
export const customPlugins = [
  i18nTranslator,
  aiPrototype,
  aiCopywriting,
];

/**
 * 根据标识符获取插件配置
 * @param identifier 插件标识符
 * @returns 插件配置或undefined
 */
export const getPluginByIdentifier = (identifier: string) => {
  return customPlugins.find(plugin => plugin.identifier === identifier);
};

/**
 * 获取所有插件元数据
 * @returns 插件元数据数组
 */
export const getPluginsMeta = () => {
  return customPlugins.map(plugin => ({
    identifier: plugin.identifier,
    ...plugin.meta,
  }));
}; 