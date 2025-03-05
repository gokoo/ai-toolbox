# 本地运行前后端指南

本指南将帮助您在本地环境中同时运行 Lobe Chat 前端和我们开发的后端服务，以便测试和开发。

## 1. 环境准备

### 1.1 必要软件

- **Node.js**: 版本 22+ (后端要求)
- **MongoDB**: 版本 6+
- **Git**: 用于克隆代码

### 1.2 推荐工具

- **MongoDB Compass**: MongoDB 的图形界面工具
- **Postman** 或 **Insomnia**: API 测试工具
- **VS Code**: 代码编辑器

## 2. 后端设置

### 2.1 数据库设置

1. 确保 MongoDB 服务已启动
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu
   sudo systemctl start mongod
   
   # Windows
   # 通过服务管理器启动 MongoDB 服务
   ```

2. 创建数据库
   ```bash
   # 连接到 MongoDB
   mongo
   
   # 创建数据库
   use ai-toolbox
   
   # 退出
   exit
   ```

### 2.2 配置环境变量

1. 检查 `.env` 文件，确保以下配置正确：
   ```
   DATABASE_URI=mongodb://localhost:27017/ai-toolbox
   PORT=3000
   CORS_ORIGIN=http://localhost:3010
   ```

2. 如果需要使用 OpenAI 功能，请设置您的 API 密钥：
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

### 2.3 安装依赖并启动后端

1. 进入后端目录
   ```bash
   cd /Users/zhangyifei/Desktop/toolsFromLebo/backend
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```

4. 验证后端是否正常运行
   - 访问 http://localhost:3000/api-docs 查看 API 文档
   - 应该看到 Swagger UI 界面，显示所有可用的 API 端点

## 3. 前端设置

### 3.1 配置环境变量

1. 在 Lobe Chat 前端目录创建 `.env.local` 文件
   ```bash
   cd /Users/zhangyifei/Desktop/toolsFromLebo/frontend/lobe-chat
   touch .env.local
   ```

2. 添加以下内容到 `.env.local`：
   ```
   # 使用自定义后端 API
   NEXT_PUBLIC_CUSTOM_API_URL=http://localhost:3000/api/v1
   
   # 禁用内置数据库
   DATABASE_TYPE=none
   
   # 启用自定义后端认证
   NEXT_PUBLIC_CUSTOM_AUTH=true
   ```

### 3.2 安装依赖并启动前端

1. 安装依赖
   ```bash
   # 使用 npm
   npm install
   
   # 或使用 pnpm (如果 Lobe Chat 使用 pnpm)
   pnpm install
   ```

2. 启动开发服务器
   ```bash
   # 使用 npm
   npm run dev
   
   # 或使用 pnpm
   pnpm dev
   ```

3. 验证前端是否正常运行
   - 访问 http://localhost:3010
   - 应该看到 Lobe Chat 的登录界面

## 4. 连接前后端

### 4.1 创建测试用户

使用 API 测试工具（如 Postman）创建一个测试用户：

1. 发送 POST 请求到 `http://localhost:3000/api/v1/auth/register`
2. 请求体：
   ```json
   {
     "name": "测试用户",
     "email": "test@example.com",
     "password": "password123",
     "passwordConfirm": "password123"
   }
   ```

### 4.2 登录测试

1. 在 Lobe Chat 前端登录页面输入刚才创建的用户凭据
2. 如果一切配置正确，应该能够成功登录并看到空的聊天界面

### 4.3 测试基本功能

1. 创建新会话
2. 发送消息
3. 查看会话列表
4. 测试会话管理功能（收藏、置顶、归档等）

## 5. 常见问题与解决方案

### 5.1 跨域问题

如果遇到跨域错误：

1. 确保后端 `.env` 中的 `CORS_ORIGIN` 设置正确
2. 确保前端请求的 API URL 正确
3. 检查浏览器控制台的错误信息

### 5.2 数据库连接问题

如果后端无法连接到数据库：

1. 确保 MongoDB 服务正在运行
2. 检查 `.env` 中的 `DATABASE_URI` 是否正确
3. 尝试使用 MongoDB Compass 连接数据库，确认连接字符串有效

### 5.3 前端 API 请求失败

如果前端无法成功调用后端 API：

1. 检查浏览器网络请求，查看具体错误
2. 确认 `.env.local` 中的 `NEXT_PUBLIC_CUSTOM_API_URL` 设置正确
3. 使用 Postman 直接测试 API 端点，确认后端正常工作

### 5.4 认证问题

如果登录失败：

1. 确保用户已正确创建
2. 检查后端 JWT 配置是否正确
3. 确认前端正确处理认证令牌

## 6. 下一步开发

成功运行前后端后，您可以继续开发以下功能：

1. 完善插件系统
2. 实现文件上传功能
3. 集成更多 AI 模型
4. 优化性能和用户体验

## 7. 参考资源

- [Lobe Chat 文档](https://github.com/lobehub/lobe-chat)
- [MongoDB 文档](https://docs.mongodb.com/)
- [Express.js 文档](https://expressjs.com/)
- [Next.js 文档](https://nextjs.org/docs)