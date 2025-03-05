# AI原型图生成插件

这是AI工具箱的原型图生成插件，根据用户的文本描述生成HTML/SVG原型图，支持预览和导出功能。

## 功能特点

- 根据文本描述生成UI原型图
- 支持多种组件和布局
- 提供多种预设模板
- 实时预览生成结果
- 支持导出为HTML、SVG、PNG等格式
- 支持多种AI模型（OpenAI, Midjourney等）

## 目录结构

```
prototype-generator/
├── components/      # UI组件
├── services/        # API服务
├── utils/           # 工具函数
├── types/           # 类型定义
├── templates/       # 预设模板
├── index.ts         # 插件入口
└── README.md        # 文档
```

## 开发计划

### 阶段一：基础功能（1周）
- [ ] 创建基本UI界面
- [ ] 实现文本到HTML的基本转换
- [ ] 接入OpenAI API
- [ ] 支持基本的预览功能

### 阶段二：高级功能（1-2周）
- [ ] 添加多种预设模板
- [ ] 实现自定义样式调整
- [ ] 添加组件库支持
- [ ] 实现导出功能

### 阶段三：优化与测试（1周）
- [ ] UI/UX优化
- [ ] 性能优化
- [ ] 单元测试和集成测试
- [ ] 文档完善

## 使用方法

1. 输入UI界面的文本描述
2. 选择预设模板和样式
3. 选择AI模型和相关设置
4. 点击生成按钮
5. 预览生成结果并可选择导出

## API接口

插件将调用后端的以下API：

- `POST /api/v1/prototype/generate` - 生成原型图
- `POST /api/v1/prototype/export` - 导出原型图
- `GET /api/v1/prototype/templates` - 获取预设模板
- `GET /api/v1/prototype/history` - 获取历史记录 