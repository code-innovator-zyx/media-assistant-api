# Media Assistant API

一个强大的 Markdown 转 HTML 的 API 服务，专注于提供美观、可定制的内容转换能力。支持多种高级特性，让您的 Markdown 内容转换更加灵活和专业。

[在线转换地址](https://md.openwrite.cn/)

## 📝 TODO

### 🎨 功能增强
- [x] 支持更多 Markdown 扩展语法
- [x] 添加更多预设主题
- [x] 支持自定义代码高亮主题
- [ ] 增加图片处理功能（压缩、水印等）
- [ ] 支持导出 PDF 格式

### 🔍 测试与质量
- [ ] 增加单元测试覆盖率
- [ ] 添加端到端测试
- [ ] 引入性能基准测试
- [x] 完善错误处理机制


### 📚 文档完善
- [x] 添加详细的 API 使用示例
- [x] 编写开发者贡献指南
- [ ] 补充常见问题解答（FAQ）
- [x] 添加在线演示环境


## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/media-assistant-api.git

# 进入项目目录
cd media-assistant-api

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## ✨ 特性

- 🎨 支持自定义主题样式
  - 可配置字体、颜色、间距等样式
  - 支持暗黑模式切换
  - 提供多套预设主题
  - 支持自定义 CSS 样式覆盖

- 📊 支持 Mermaid 图表渲染
  - 流程图
  - 时序图
  - 甘特图
  - 类图等

- ✍️ 支持 KaTeX 数学公式
  - 行内公式
  - 块级公式
  - 支持所有 KaTeX 语法

- 🎯 支持自定义警告框
  - 信息提示
  - 警告提示
  - 错误提示
  - 成功提示

- 💫 支持 Mac 风格代码块
  - 代码高亮
  - 行号显示
  - 复制功能
  - 语言标识

- 🔗 支持脚注和引用链接
- 📱 响应式设计，完美适配移动端
- 🎈 轻量级，易于部署

## 🖼️ 预览效果

![预览效果图](assets/preview.png)

## 📦 API 文档

### 1. Markdown 转 HTML

将 Markdown 文本转换为 HTML 格式。

```http
POST /markdown/html
Content-Type: application/json

请求体：
{
  "data": "# Your Markdown Content",    // Markdown 内容（必填）
  "isMacCodeBlock": true,              // 是否启用 Mac 风格代码块（可选）
  "theme": "经典",                    // 主题名称（可选）：经典、优雅
  "fontFamily": "无衬线",              // 字体类型（可选）：无衬线、衬线、等宽
  "fontSize": "15px",                 // 字号：12px-16px（可选）
  "isUseIndent": true,                // 是否使用缩进（可选）
  "primaryColor": "#1890ff",          // 主色调（可选）
  "citeStatus": true,                 // 是否启用引用（可选）
  "legend": "只显示 title",           // 图例样式（可选）：title 优先、alt 优先、只显示 title、只显示 alt、不显示
"codeTheme":"https://cdn.bootcdn.net/ajax/libs/highlight.js/11.10.0/styles/an-old-hope.min.css"              // 代码主题css 地址
}

响应：
{
  "status": "success",
  "data": {
    "html": "<div class='markdown-body'>...转换后的HTML内容...</div>"
  }
}
```

### 2. 效果预览

获取一个包含示例内容的 Markdown 预览页面。

```http
GET /markdown/preview

查询参数：
- isMacCodeBlock: boolean  // 是否启用 Mac 风格代码块
- theme: string           // 主题名称
- fontFamily: string      // 字体类型
- fontSize: string        // 字号
- isUseIndent: boolean    // 是否使用缩进
- primaryColor: string    // 主色调
- citeStatus: boolean     // 是否启用引用
- legend: string         // 图例样式
- codeTheme: string      // 代码主题

响应：
返回一个包含预览内容的 HTML 页面
```


## 🛠️ 项目配置

### 环境变量

在项目根目录创建 `.env` 文件：

```env
PORT=3000                # 服务端口
NODE_ENV=development     # 运行环境
```

### 主题配置

在 `src/config/theme.ts` 中可以自定义主题样式：

```typescript
export const themes = {
  default: {
    fontSize: '16px',
    lineHeight: '1.6',
    // 更多样式配置...
  },
  dark: {
    // 暗黑主题配置
  }
}
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交改动：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。
