# AI 工具箱

这是一个集成了多种 AI 功能的工具箱应用，包括文案生成、原型设计、国际化翻译等功能。

## 项目结构

项目分为前端和后端两部分：

### 后端 (backend)

基于 Node.js 和 Express 框架开发的 RESTful API 服务，提供以下功能：

- 用户认证与授权
- 文案生成
- 原型设计
- 国际化翻译
- 插件系统

### 前端 (frontend)

包含多个前端项目：

- **test-client**: 简单的测试客户端，用于测试后端 API
- **lobe-chat**: 基于 Next.js 的聊天应用
- **custom-plugins**: 自定义插件，包括 i18n 翻译插件等

## 技术栈

### 后端

- Node.js
- Express
- MongoDB
- JWT 认证
- OpenAI API

### 前端

- React
- Next.js
- Bootstrap
- TypeScript

## 安装与运行

### 后端

```bash
cd backend
npm install
npm run dev
```

服务将在 http://localhost:3000 运行，API 文档可在 http://localhost:3000/api-docs 访问。

### 测试客户端

```bash
cd frontend/test-client
python -m http.server 3010
```

客户端将在 http://localhost:3010 运行。

### Lobe Chat

```bash
cd frontend/lobe-chat
npm install
npm run dev
```

应用将在 http://localhost:3010 运行。

## 环境变量

后端需要以下环境变量：

- `NODE_ENV`: 运行环境
- `PORT`: 服务端口
- `DATABASE_URI`: MongoDB 连接 URI
- `JWT_SECRET`: JWT 密钥
- `OPENAI_API_KEY`: OpenAI API 密钥

## 许可证

MIT 