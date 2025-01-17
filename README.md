# Media Assistant API

一个强大的 Markdown 转 HTML 的 API 服务，专注于提供美观、可定制的内容转换能力。

## ✨ 特性

- 🎨 支持自定义主题样式
- 📊 支持 Mermaid 图表渲染
- ✍️ 支持 KaTeX 数学公式
- 🎯 支持自定义警告框
- 💫 支持 Mac 风格代码块
- 🔗 支持脚注和引用链接
- 📱 响应式设计，完美适配移动端
- 🎈 轻量级，易于部署

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone git@github.com:code-innovator-zyx/media-assistant-api.git

# 进入项目目录
cd media-assistant-api

# 安装依赖
pnpm install
```

### 运行

```bash
# 开发环境
pnpm dev

# 生产环境
pnpm build
npm start
```

## 📦 API 使用

### 转换 Markdown 到 HTML

```http
POST /md/html
Content-Type: application/json

{
  "data": "# Your Markdown Content",
  "isMacCodeBlock": true
}
```

### 下载示例

```http
GET /md/download
```

## 🛠️ 技术栈

- Node.js
- Express
- TypeScript
- Marked
- KaTeX
- Mermaid
- Highlight.js

## 📝 配置说明

项目支持多种自定义配置，包括：

- 主题样式定制
- 代码高亮主题
- 字体设置
- 缩进配置
- 引用链接样式

详细配置请参考 `src/types/index.ts`。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request。

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目：

- [marked](https://github.com/markedjs/marked)
- [highlight.js](https://github.com/highlightjs/highlight.js)
- [KaTeX](https://github.com/KaTeX/KaTeX)
- [mermaid](https://github.com/mermaid-js/mermaid) 