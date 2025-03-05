# 前端开发规范

## 代码风格

1. **命名规范**
   - 组件使用PascalCase命名（如`TranslationTool.tsx`）
   - 函数和变量使用camelCase命名（如`handleSubmit`）
   - 常量使用UPPER_SNAKE_CASE命名（如`API_ENDPOINT`）
   - 文件名使用kebab-case命名（如`translation-service.ts`）

2. **代码格式化**
   - 使用Prettier进行代码格式化
   - 缩进使用2个空格
   - 行尾使用分号
   - 字符串使用单引号

3. **注释规范**
   - 组件顶部添加功能描述注释
   - 复杂逻辑添加详细注释
   - 使用JSDoc风格的注释

## 开发流程

1. **分支管理**
   - 主分支：`main`
   - 开发分支：`dev`
   - 功能分支：`feature/功能名称`
   - 修复分支：`fix/问题描述`

2. **提交规范**
   - feat: 新功能
   - fix: 修复bug
   - docs: 文档更新
   - style: 代码风格调整
   - refactor: 代码重构
   - perf: 性能优化
   - test: 测试相关
   - chore: 构建过程或辅助工具的变动

3. **代码审查**
   - 每个PR至少需要一个审查者
   - 确保代码通过所有自动化测试
   - 遵循项目的代码风格指南

## 插件开发规范

1. **目录结构**
   ```
   custom-plugins/插件名称/
   ├── index.ts         # 插件入口
   ├── components/      # 组件目录
   ├── services/        # 服务目录
   ├── utils/           # 工具函数
   ├── types/           # 类型定义
   └── README.md        # 插件文档
   ```

2. **插件接口**
   - 每个插件必须实现标准的插件接口
   - 插件需要提供清晰的配置选项
   - 插件应当支持国际化

3. **UI规范**
   - 遵循Lobe Chat的设计风格
   - 支持亮色和暗色主题
   - 确保移动端友好的UI设计

## 性能优化准则

1. 使用React.memo避免不必要的重渲染
2. 使用useMemo和useCallback优化性能
3. 实现代码分割减小初始加载体积
4. 优化图片和资源加载
5. 使用适当的缓存策略

## 测试规范

1. 组件单元测试覆盖率不低于80%
2. 关键功能需要编写集成测试
3. 使用Jest和React Testing Library进行测试
4. 模拟API请求使用MSW 