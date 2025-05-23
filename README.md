# Media Assistant API

[English](README.en.md) | 简体中文

Media Assistant API 是一个功能强大的 Markdown 转 HTML 服务，致力于提供美观且可定制的内容转换能力。支持多种高级特性，让 Markdown 内容转换更灵活、更专业。

👉 在线体验：[点击前往](https://md.openwrite.cn/)

---

## 📝 开发计划（TODO）

### 🎨 功能增强

* ✅ 支持更多 Markdown 扩展语法
* ✅ 添加多种预设主题
* ✅ 动态样式切换
* ✅ 自定义字体与样式
* ✅ 支持自定义 CSS 与代码高亮主题
* ⬜ 增加图片处理功能（压缩、水印等）
* ⬜ 支持导出 PDF 格式

### 📚 文档完善

* ✅ 提供完整的 API 使用示例
* ⬜ 编写贡献指南
* ⬜ 补充常见问题解答（FAQ）
* ✅ 提供在线演示环境

---

## ✨ 核心特性

### 🎨 自定义主题样式

* 配置字体、颜色、间距等参数
* 支持暗黑模式
* 提供多套主题，支持自定义 CSS 覆盖

### 📊 Mermaid 图表支持

* 流程图、时序图、甘特图、类图等

### ✍️ 数学公式支持（KaTeX）

* 行内与块级公式
* 完整支持 KaTeX 语法

### 🎯 自定义提示框

* 支持信息、警告、错误、成功四种提示类型

### 💫 Mac 风格代码块

* 高亮、行号、复制按钮、语言标识

### 🔗 脚注与引用链接支持

### 📱 响应式设计，完美适配移动端

### 🎈 轻量部署，快速上手

---

## 📦 API 接口说明

### Markdown 转 HTML

* **接口路径**：`POST /markdown/html`
* **请求头**：`Content-Type: application/json`
* **请求体**：

```json
{
  "data": "# Markdown 内容",           // 必填
  "isMacCodeBlock": true,               // 启用 Mac 风格代码块（可选）
  "theme": "default",                  // 主题名称：default、grace（可选）
  "fontFamily": "无衬线",              // 字体类型：无衬线、衬线、等宽（可选）
  "fontSize": "15px",                 // 字体大小（例如：14px）（可选）
  "isUseIndent": true,                 // 是否启用缩进（可选）
  "primaryColor": "#1890ff",          // 主色调（可选）
  "citeStatus": true,                  // 是否启用引用（可选）
  "legend": "只显示 title",            // 图例样式（可选）
  "codeTheme": "1c-light"             // 代码高亮主题（可选）
}
```

* **响应示例**：

```json
{
  "status": "success",
  "data": {
    "html": "<div class='markdown-body'>...转换后的HTML内容...</div>"
  }
}
```

### 支持的代码高亮主题

| 主题名称            | 描述                 |
| ------------------- | -------------------- |
| `1c-light`          | 1C语言浅色主题       |
| `a11y-dark`         | 无障碍深色主题       |
| `a11y-light`        | 无障碍浅色主题       |
| `agate`             | 玛瑙主题             |
| `an-old-hope`       | 旧希望主题           |
| `androidstudio`     | Android Studio 风格  |
| `arduino-light`     | Arduino 浅色主题     |
| `arta`              | 艺术主题             |
| `ascetic`           | 简朴主题             |
| `atom-one-dark`     | Atom 深色主题        |
| `atom-one-light`    | Atom 浅色主题        |
| `github-dark`       | GitHub 深色主题      |
| `github`            | GitHub 标准主题      |
| `monokai`           | Monokai 经典主题     |
| `monokai-sublime`   | Sublime Monokai 风格 |
| `nord`              | 北欧极光风格主题     |
| `tokyo-night-dark`  | 东京之夜深色主题     |
| `tokyo-night-light` | 东京之夜浅色主题     |
| `vs`                | Visual Studio 主题   |
| `vs2015`            | Visual Studio 2015   |
| `xcode`             | Xcode 风格           |

---

### 🖼️ Markdown 示例预览

* **接口路径**：`GET /markdown/preview`
* **支持参数**：同上
* **响应**：返回 HTML 页面，内含预览效果

示例图：
![预览效果图](assets/preview.png)

---

## 🚀 快速开始

```bash
# 克隆仓库
git clone git@github.com:code-innovator-zyx/media-assistant-api.git
cd media-assistant-api

# 安装依赖
pnpm install

# 启动开发服务
pnpm dev
```

---

## 🛠️ 配置说明

### 环境变量

在根目录创建 `.env` 文件：

```env
PORT=3000
NODE_ENV=development
```

### 默认主题配置

在 `src/config/theme.ts` 中自定义：

```ts
export const themes = {
  default: {
    fontSize: '16px',
    lineHeight: '1.6',
    // 更多配置...
  },
  dark: {
    // 暗黑主题配置
  }
}
```

---

## 📌 示例调用（Python）

```python
def parse_html(md: str):
    params = {
        "data": md,
        "isMacCodeBlock": False,
        "fontSize": "14px"
    }
    res = requests.post(
        url="http://localhost:8080/api/markdown/html",
        data=json.dumps(params),
        headers={"Content-Type": "application/json"}
    )
    res.raise_for_status()
    return res.json()["data"]
```

---

## 🤝 贡献指南

1. Fork 本项目
2. 新建分支：`git checkout -b feature/你的功能名称`
3. 提交更改：`git commit -m '添加功能说明'`
4. 推送分支：`git push origin feature/你的功能名称`
5. 发起 Pull Request

---

## 📄 开源协议

本项目遵循 [MIT](LICENSE) 协议开源，欢迎使用与贡献！
