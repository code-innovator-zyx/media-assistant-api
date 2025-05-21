# 自媒体自动化辅助API

> 本文将介绍一个自媒体自动化辅助工具，目前可以通过 Markdown 转换为 HTML，实现文章的格式化和跨平台兼容。

## 项目背景

在这自媒体自动化创作的过程中，内容的格式化和跨平台兼容是一个重要的需求。Markdown 作为一种简洁的标记语言，广泛应用于内容创作，特别是对于我们这种程序员来说，更热衷于markdown 写文章。然而，不同平台对 Markdown 的支持程度不一，因此需要一种高效的方式将 Markdown 转换为 HTML，以确保内容在各个平台上的一致性展示。

> 在此之前，在我自己的自动化自媒体中心为了把markdown 转成html,我都是使用selenium 访问 - [在线转换工具](https://md.openwrite.cn),转换后下载到本地，后面用起来效率太低也太蠢了，就自己写了一个这样的Node服务来处理。


## 开源地址

- [GitHub 项目链接](https://github.com/your-username/media-assistant-api)


## 项目特性

本项目提供了丰富的功能特性，包括：

- 🎨 支持自定义主题样式：可配置字体、颜色、间距等样式，支持暗黑模式切换，提供多套预设主题，支持自定义 CSS 样式覆盖。
- 📊 支持 Mermaid 图表渲染：流程图、时序图、甘特图、类图等。
- ✍️ 支持 KaTeX 数学公式：行内公式、块级公式，支持所有 KaTeX 语法。
- 🎯 支持自定义警告框：信息提示、警告提示、错误提示、成功提示。
- 💫 支持 Mac 风格代码块：代码高亮、行号显示、复制功能、语言标识。
- 🔗 支持脚注和引用链接。
- 📱 响应式设计，完美适配移动端。
- 🎈 轻量级，易于部署。

## API 文档

### 1. Markdown 转 HTML

将 Markdown 文本转换为 HTML 格式。

```http
POST /markdown/html
Content-Type: application/json

// 请求体：
{
  "data": "# Your Markdown Content",    // Markdown 内容（必填）
  "isMacCodeBlock": true,              // 是否启用 Mac 风格代码块（可选）
  "theme": "default",                    // 主题名称（可选）：default、grace
  "fontFamily": "无衬线",              // 字体类型（可选）：无衬线、衬线、等宽
  "fontSize": "15px",                 // 字号：任意像素值  例: 14px
  "isUseIndent": true,                // 是否使用缩进（可选）
  "primaryColor": "#1890ff",          // 主色调（可选）
  "citeStatus": true,                 // 是否启用引用（可选）
  "legend": "只显示 title",           // 图例样式（可选）：title 优先、alt 优先、只显示 title、只显示 alt、不显示
  "codeTheme":"https://cdn.bootcdn.net/ajax/libs/highlight.js/11.10.0/styles/an-old-hope.min.css"// 代码主题css 地址
}

//响应：
{
  "status": "success",
  "data": {
    "html": "<div class='markdown-body'>...转换后的HTML内容...</div>"
  }
}
```
## 示例代码

以下是一个简单的 API 调用示例：

```python
import requests

def convert_markdown(text):
    params = {
        "data": text,
        "theme": "default",
        "fontSize": "15px"
    }
    response = requests.post(
        "https://api.example.com/markdown/html",
        json=params
    )
    return response.json()["data"]
```
## 结语

通过本项目，您可以轻松实现自媒体内容的自动化处理，提升创作效率和展示效果。项目的丰富特性和灵活的 API 接口使其成为内容创作者的理想工具。