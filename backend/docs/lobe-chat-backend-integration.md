# Lobe Chat 后端集成文档

## 1. 项目概述

本文档总结了基于 Lobe Chat 框架开发的 AI 工具箱后端集成要点，旨在确保后端实现与 Lobe Chat 前端框架的兼容性和一致性。

## 2. 数据模型对比

### 2.1 Session 模型

| 前端期望字段 | 后端实现字段 | 匹配状态 | 说明 |
|------------|------------|---------|------|
| id | _id | ✅ | MongoDB 使用 _id 作为主键 |
| topic | topic | ✅ | 会话主题 |
| favorite | favorite | ✅ | 是否收藏 |
| pinned | pinned | ✅ | 是否置顶 |
| archived | archived | ✅ | 是否归档 |
| agentId | agentId | ✅ | 关联的 AI 助手 ID |
| metadata | metadata | ✅ | 会话元数据 |
| createdAt | createdAt | ✅ | 创建时间 |
| updatedAt | updatedAt | ✅ | 更新时间 |
| lastMessageId | lastMessageId | ✅ | 最后一条消息 ID |
| lastMessageCreatedAt | lastMessageCreatedAt | ✅ | 最后一条消息创建时间 |

### 2.2 Message 模型

| 前端期望字段 | 后端实现字段 | 匹配状态 | 说明 |
|------------|------------|---------|------|
| id | _id | ✅ | MongoDB 使用 _id 作为主键 |
| sessionId | sessionId | ✅ | 关联的会话 ID |
| role | role | ✅ | 消息角色（user/assistant/system） |
| content | content | ✅ | 消息内容 |
| meta | meta | ✅ | 消息元数据 |
| createdAt | createdAt | ✅ | 创建时间 |
| updatedAt | updatedAt | ✅ | 更新时间 |
| parentId | parentId | ✅ | 父消息 ID（用于消息树结构） |
| quotaId | quotaId | ✅ | 引用消息 ID |
| plugin | plugin | ✅ | 插件相关信息 |
| files | files | ✅ | 关联文件 |

## 3. API 接口评估

### 3.1 Session 接口

| 前端期望接口 | 后端实现接口 | 匹配状态 | 说明 |
|------------|------------|---------|------|
| getSessions | GET /api/sessions | ✅ | 获取用户会话列表 |
| createSession | POST /api/sessions | ✅ | 创建新会话 |
| getSession | GET /api/sessions/:id | ✅ | 获取单个会话详情 |
| updateSession | PATCH /api/sessions/:id | ✅ | 更新会话信息 |
| deleteSession | DELETE /api/sessions/:id | ✅ | 删除会话 |
| clearSessionMessages | DELETE /api/sessions/:id/messages | ✅ | 清空会话消息 |
| getSessionMessages | GET /api/sessions/:id/messages | ✅ | 获取会话消息列表 |

### 3.2 Plugin 接口

| 前端期望接口 | 后端实现接口 | 匹配状态 | 说明 |
|------------|------------|---------|------|
| getInstalledPlugins | GET /api/plugins | 🔄 | 获取已安装插件列表 |
| installPlugin | POST /api/plugins | 🔄 | 安装新插件 |
| uninstallPlugin | DELETE /api/plugins/:id | 🔄 | 卸载插件 |
| updatePlugin | PATCH /api/plugins/:id | 🔄 | 更新插件信息 |
| updatePluginSettings | PATCH /api/plugins/:id/settings | 🔄 | 更新插件设置 |
| createCustomPlugin | POST /api/plugins/custom | 🔄 | 创建自定义插件 |

## 4. 开发里程碑

### 4.1 基础功能完善（当前阶段）

- [x] 用户认证与授权系统
- [x] 会话管理 CRUD 操作
- [x] 消息管理 CRUD 操作
- [ ] 文件上传与管理
- [ ] 基本 AI 模型集成

### 4.2 高级功能开发

- [ ] 多模型支持（OpenAI、Azure、本地模型等）
- [ ] 会话导出/导入功能
- [ ] 用户偏好设置
- [ ] 多语言支持
- [ ] 高级搜索与过滤

### 4.3 插件系统集成

- [ ] 插件管理接口
- [ ] 插件安装与卸载
- [ ] 插件设置管理
- [ ] 自定义插件创建
- [ ] 插件权限控制

### 4.4 性能优化

- [ ] 数据库索引优化
- [ ] 缓存策略实现
- [ ] 消息分页与懒加载
- [ ] 大型会话性能优化
- [ ] 服务器资源使用监控

### 4.5 安全增强

- [ ] API 速率限制
- [ ] 数据加密存储
- [ ] 敏感信息过滤
- [ ] 安全审计日志
- [ ] CSRF/XSS 防护增强

## 5. 技术栈总结

### 5.1 前端（Lobe Chat）

- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Lobe UI 组件库
- IndexedDB/LocalStorage（客户端存储）
- WebSocket（实时通信）

### 5.2 后端（自定义实现）

- Node.js 22+
- Express.js
- MongoDB
- JWT 认证
- OpenAI API 集成
- 云存储集成（阿里云/腾讯云）
- WebSocket 服务

## 6. 开发注意事项

### 6.1 前后端兼容性

- 严格遵循 Lobe Chat 前端的数据结构和字段命名
- 保持 API 响应格式与前端期望一致
- 实现所有前端依赖的 API 端点
- 确保错误处理与前端预期匹配

### 6.2 插件系统开发

- 遵循 Lobe Chat 插件 SDK 规范
- 确保插件清单（manifest）格式正确
- 实现插件所需的后端 API 支持
- 提供插件设置的持久化存储

### 6.3 安全考虑

- 所有 API 端点需要适当的认证和授权
- 实现 API 密钥和敏感信息的安全存储
- 防止 SQL 注入和 NoSQL 注入攻击
- 实现适当的 CORS 策略

### 6.4 性能优化

- 实现数据分页以处理大量记录
- 使用适当的缓存策略减少数据库负载
- 优化大型会话和消息历史的加载
- 考虑使用流式响应处理长文本生成

## 7. 下一步工作

1. 完成插件管理 API 的实现
2. 集成文件上传和管理功能
3. 实现 AI 模型调用的代理和缓存
4. 添加用户偏好设置的持久化
5. 开发会话导出/导入功能
6. 实现基本的监控和日志系统

## 8. 参考资源

- [Lobe Chat GitHub 仓库](https://github.com/lobehub/lobe-chat)
- [Lobe Chat 插件 SDK 文档](https://github.com/lobehub/chat-plugin-sdk)
- [Lobe Chat 数据库模型定义](https://github.com/lobehub/lobe-chat/tree/main/src/database/schemas)
- [Lobe Chat API 服务定义](https://github.com/lobehub/lobe-chat/tree/main/src/services)