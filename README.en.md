# Media Assistant API

[简体中文](README.zh.md) | English

A powerful API service that converts Markdown to HTML, focused on providing beautiful and customizable content conversion. Supports a wide range of advanced features to make your Markdown transformation more flexible and professional.

👉 [Live Demo](https://md.openwrite.cn/)

## 📝 TODO

### 🎨 Feature Enhancements
- [x] Support for more Markdown extended syntax
- [x] Add more preset themes
- [x] Support dynamic style switching
- [x] Support custom fonts
- [x] Add custom CSS styling
- [x] Support custom Markdown extensions
- [x] Support custom theme styles
- [x] Support custom code highlight themes
- [ ] Add image processing features (compression, watermark, etc.)
- [ ] Support exporting to PDF

### 📚 Documentation Improvements
- [x] Add detailed API usage examples
- [ ] Write a contributor guide
- [ ] Add Frequently Asked Questions (FAQ)
- [x] Provide an online demo environment

## ✨ Features

- 🎨 Custom Theme Styles
  - Configurable fonts, colors, spacing, etc.
  - Dark mode support
  - Multiple preset themes
  - Custom CSS style overrides

- 📊 Mermaid Diagram Rendering
  - Flowcharts
  - Sequence diagrams
  - Gantt charts
  - Class diagrams and more

- ✍️ KaTeX Math Formula Support
  - Inline formulas
  - Block formulas
  - Full KaTeX syntax support

- 🎯 Custom Alert Boxes
  - Info alerts
  - Warning alerts
  - Error alerts
  - Success alerts

- 💫 Mac-style Code Blocks
  - Syntax highlighting
  - Line numbers
  - Copy functionality
  - Language identifier

- 🔗 Footnotes and Reference Links
- 📱 Responsive design, mobile-friendly
- 🎈 Lightweight and easy to deploy

## 📦 API Documentation

### 1. Markdown to HTML

Convert Markdown text to HTML.

`POST /markdown/html`  
`Content-Type: application/json`

```json
{
  "data": "# Your Markdown Content",
  "isMacCodeBlock": true,
  "theme": "default",
  "fontFamily": "sans-serif",
  "fontSize": "15px",
  "isUseIndent": true,
  "primaryColor": "#1890ff",
  "citeStatus": true,
  "legend": "title only",
  "codeTheme": "1c-light"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "html": "<div class='markdown-body'>...converted HTML...</div>"
  }
}
```

Available Code Themes:

| Name              | Description               |
| ----------------- | ------------------------- |
| 1c-light          | 1C language light theme   |
| a11y-dark         | Accessibility dark theme  |
| a11y-light        | Accessibility light theme |
| agate             | Agate theme               |
| an-old-hope       | Old Hope theme            |
| androidstudio     | Android Studio theme      |
| arduino-light     | Arduino light theme       |
| arta              | Arta theme                |
| ascetic           | Minimalist theme          |
| atom-one-dark     | Atom dark theme           |
| atom-one-light    | Atom light theme          |
| github-dark       | GitHub dark theme         |
| github            | GitHub standard theme     |
| monokai           | Monokai theme             |
| monokai-sublime   | Sublime Monokai theme     |
| nord              | Nord theme                |
| tokyo-night-dark  | Tokyo Night dark          |
| tokyo-night-light | Tokyo Night light         |
| vs                | Visual Studio theme       |
| vs2015            | VS2015 dark theme         |
| xcode             | Xcode theme               |

### 2. 🖼️ Preview

```http
GET /markdown/preview
```

Query Parameters:
- `isMacCodeBlock`: boolean  
- `theme`: string (`default`, `grace`)  
- `fontFamily`: string (`sans-serif`, `serif`, `monospace`)  
- `fontSize`: string (e.g., "14px")  
- `isUseIndent`: boolean  
- `primaryColor`: string  
- `citeStatus`: boolean  
- `legend`: string (`title only`, `alt only`, `both`, `none`)  
- `codeTheme`: string  

Returns an HTML page with a preview of rendered content.

## 🚀 Quick Start

### Install

```bash
# Clone the project
git clone git@github.com:code-innovator-zyx/media-assistant-api.git
cd media-assistant-api

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
```

### Theme Configuration

Customize default theme styles in `src/config/theme.ts`:

```ts
export const themes = {
  default: {
    fontSize: '16px',
    lineHeight: '1.6',
    // Additional styles...
  },
  dark: {
    // Dark theme settings
  }
}
```

### Example Call (Python)

```python
import requests
import json

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

## 🤝 Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).