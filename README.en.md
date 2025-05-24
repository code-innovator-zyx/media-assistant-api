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
| Theme Name               | Alias                | Style Description                                    |
| ------------------------ | -------------------- | ---------------------------------------------------- |
| 1c-light                 | 1C Light             | Bright light theme inspired by 1C                    |
| a11y-dark                | A11Y Dark            | High contrast, accessible dark theme                 |
| a11y-light               | A11Y Light           | High contrast, accessible light theme                |
| agate                    | Agate                | Soft dark theme                                      |
| an-old-hope              | An Old Hope          | Dark theme with blue tones, inspired by Star Wars    |
| androidstudio            | Android Studio       | Android Studio editor color scheme                   |
| arduino-light            | Arduino Light        | Arduino IDE inspired light theme                     |
| arta                     | Arta                 | Bright theme with strong contrast, artistic feel     |
| ascetic                  | Ascetic              | Minimal, clean layout without background             |
| atom-one-dark-reasonable | Atom Reasonable Dark | Enhanced contrast version of Atom Dark               |
| atom-one-dark            | Atom Dark            | Classic Atom dark theme                              |
| atom-one-light           | Atom Light           | Classic Atom light theme                             |
| brown-paper              | Brown Paper          | Retro theme with kraft paper texture                 |
| codepen-embed            | CodePen Embed        | Style for embedded CodePen snippets                  |
| color-brewer             | Color Brewer         | Multicolor theme with rich palette                   |
| dark                     | Dark                 | Basic pure dark theme                                |
| default                  | Default              | Default highlight.js theme                           |
| devibeans                | Devibeans            | Strong contrast, minimalist dark theme               |
| docco                    | Docco                | Document-like layout, highly readable                |
| far                      | FAR Manager          | Imitates FAR file manager UI                         |
| felipec                  | Felipe Style         | Personalized theme with color contrasts              |
| foundation               | Foundation           | Based on Foundation framework styling                |
| github-dark-dimmed       | GitHub Dimmed        | Low-brightness GitHub dark theme                     |
| github-dark              | GitHub Dark          | Official GitHub dark theme                           |
| github                   | GitHub               | Official GitHub light theme                          |
| gml                      | GML                  | GameMaker Language style                             |
| googlecode               | Google Code          | Classic Google Code color scheme                     |
| gradient-dark            | Gradient Dark        | Cool dark theme with gradient background             |
| gradient-light           | Gradient Light       | Modern light theme with gradient effects             |
| grayscale                | Grayscale            | Gray-toned theme, minimalist and eye-friendly        |
| hybrid                   | Hybrid               | Neutral theme combining multiple color styles        |
| idea                     | IntelliJ IDEA        | JetBrains dark theme                                 |
| intellij-light           | IntelliJ Light       | JetBrains light theme                                |
| ir-black                 | IR Black             | Classic hacker style with black background           |
| isbl-editor-dark         | ISBL Dark            | Dark theme for ISBL editor                           |
| isbl-editor-light        | ISBL Light           | Light theme for ISBL editor                          |
| kimbie-dark              | Kimbie Dark          | Retro dark theme with yellow and brown tones         |
| kimbie-light             | Kimbie Light         | Soft yellow-brown light theme                        |
| lightfair                | Lightfair            | Clean and bright with blue undertones                |
| lioshi                   | Lioshi               | Stylish, unique dark theme                           |
| magula                   | Magula               | Bright and non-straining light theme                 |
| mono-blue                | Mono Blue            | Blue-dominated, cool-tone theme                      |
| monokai-sublime          | Monokai Sublime      | Sublime Text color scheme                            |
| monokai                  | Monokai              | Classic high-contrast dark editor theme              |
| night-owl                | Night Owl            | Eye-friendly dark theme with blue-green tones        |
| nnfx-dark                | NNFX Dark            | Low-brightness black theme                           |
| nnfx-light               | NNFX Light           | Eye-friendly light green theme                       |
| nord                     | Nord                 | Arctic blue tones, soft and gentle                   |
| obsidian                 | Obsidian             | Inspired by Obsidian app's dark theme                |
| panda-syntax-dark        | Panda Dark           | High saturation dark theme for night coding          |
| panda-syntax-light       | Panda Light          | Bright and colorful light theme                      |
| paraiso-dark             | Paraiso Dark         | Soft purple-blue dark theme                          |
| paraiso-light            | Paraiso Light        | Gentle light theme                                   |
| pojoaque                 | Pojoaque             | Vintage scroll-style theme                           |
| purebasic                | PureBasic            | Blue background with white text, PureBasic IDE style |
| qtcreator-dark           | QtCreator Dark       | Dark theme for Qt Creator IDE                        |
| qtcreator-light          | QtCreator Light      | Light theme for Qt Creator IDE                       |
| rainbow                  | Rainbow              | Highly colorful, great for presentations             |
| routeros                 | RouterOS             | Mimics MikroTik RouterOS console style               |
| school-book              | School Book          | Textbook-style with annotation-like highlights       |
| shades-of-purple         | Shades of Purple     | Purple-dominated with strong visual contrast         |
| srcery                   | Srcery               | Bold red-focused high-contrast theme                 |
| stackoverflow-dark       | SO Dark              | StackOverflow dark theme                             |
| stackoverflow-light      | SO Light             | StackOverflow light theme                            |
| sunburst                 | Sunburst             | Black background with yellow-red highlights          |
| tokyo-night-dark         | Tokyo Night          | Anime-inspired purple-blue night theme               |
| tokyo-night-light        | Tokyo Day            | Light and fresh Japanese-inspired theme              |
| tomorrow-night-blue      | Tomorrow Blue        | Future-themed with blue tones                        |
| tomorrow-night-bright    | Tomorrow Bright      | Brighter version of tomorrow night theme             |
| vs                       | Visual Studio        | Light theme based on Visual Studio                   |
| vs2015                   | VS2015               | Dark theme from Visual Studio 2015                   |
| xcode                    | Xcode                | macOS Xcode editor theme                             |
| xt256                    | XT256                | Terminal-style with 16/256 colors                    |
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