# AI工具箱后端服务

这是AI工具箱的后端服务，提供API接口支持前端应用。

## 功能特性

- 用户认证与授权
- 多语言翻译服务
- AI原型生成
- AI文案生成
- 用户管理
- 历史记录管理

## 技术栈

- Node.js
- Express.js
- MongoDB
- JWT认证
- OpenAI API集成

## 开始使用

### 前提条件

- Node.js (v18+)
- MongoDB
- npm 或 yarn

### 安装

1. 克隆仓库

```bash
git clone <repository-url>
cd ai-toolbox/backend
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 环境配置

复制环境变量示例文件并根据需要修改

```bash
cp .env.example .env
```

编辑`.env`文件，填入必要的配置信息。

### 运行

开发模式运行：

```bash
npm run dev
# 或
yarn dev
```

生产模式运行：

```bash
npm start
# 或
yarn start
```

## API文档

启动服务后，可以通过以下端点访问API：

- 健康检查: `GET /api/v1/health`
- 认证相关: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`等
- 用户管理: `GET /api/v1/users`, `GET /api/v1/users/:id`等
- 翻译服务: `POST /api/v1/translate/text`, `POST /api/v1/translate/file`等
- 原型生成: `POST /api/v1/prototype/generate`等
- 文案生成: `POST /api/v1/copywriting/generate`等

详细API文档将在后续提供。

## 项目结构

```
backend/
├── src/                  # 源代码
│   ├── app.js           # 应用入口
│   ├── config/          # 配置文件
│   ├── controllers/     # 控制器
│   ├── middlewares/     # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── services/        # 服务
│   └── utils/           # 工具函数
├── .env.example         # 环境变量示例
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

## 部署

### 阿里云部署

详细的阿里云部署指南将在后续提供。

### 腾讯云部署

详细的腾讯云部署指南将在后续提供。

## 贡献指南

欢迎贡献代码，请遵循以下步骤：

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

[MIT](LICENSE) 