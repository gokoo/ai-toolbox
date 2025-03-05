# AI工具箱前端项目

本项目基于[Lobe Chat](https://github.com/lobehub/lobe-chat)进行二次开发，旨在提供一套完整的AI工具集合，包括但不限于i18N翻译、AI原型图生成、AI文案改写等功能。

## 项目结构

```
frontend/
├── lobe-chat/          # Lobe Chat原始代码
├── custom-plugins/     # 自定义插件目录
│   ├── i18n-translator/    # i18N翻译插件
│   ├── prototype-generator/ # AI原型图生成插件
│   └── copywriting/        # AI文案改写插件
├── config/             # 自定义配置
└── themes/             # 自定义主题
```

## 开发计划

### 阶段一：基础框架搭建（1-2周）
- [x] 克隆并设置Lobe Chat基础框架
- [ ] 熟悉Lobe Chat代码结构和插件系统
- [ ] 配置国际化支持
- [ ] 调整UI以适应移动端

### 阶段二：核心功能开发（2-3周）
- [ ] 开发i18N翻译插件
- [ ] 开发AI原型图生成插件
- [ ] 开发AI文案改写插件

### 阶段三：优化与测试（1-2周）
- [ ] 性能优化
- [ ] 用户体验改进
- [ ] 跨浏览器兼容性测试
- [ ] 移动端适配测试

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Ant Design
- i18next

## 如何启动

```bash
cd frontend/lobe-chat
npm install
npm run dev
```

## 如何贡献

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个Pull Request 