FROM node:22-slim

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 创建上传目录
RUN mkdir -p uploads/prototypes uploads/copywriting uploads/translations

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "src/app.js"] 