# Media Assistant API

A powerful Markdown to HTML API service focused on providing beautiful, customizable content conversion capabilities. Supporting multiple advanced features to make your Markdown content conversion more flexible and professional.

[Online Conversion Tool](https://md.openwrite.cn/)

## 📝 TODO

### 🎨 Feature Enhancements
- [x] Support more Markdown extended syntax
- [x] Add more preset themes
- [x] Support custom code highlighting themes
- [ ] Add image processing features (compression, watermark, etc.)
- [ ] Support PDF export

### 🔍 Testing & Quality
- [ ] Increase unit test coverage
- [ ] Add end-to-end testing
- [ ] Introduce performance benchmarks
- [x] Improve error handling mechanisms

### 📚 Documentation Improvements
- [x] Add detailed API usage examples
- [x] Write developer contribution guidelines
- [ ] Add Frequently Asked Questions (FAQ)
- [x] Add online demo environment

## 🚀 Quick Start

### Installation

```bash
# Clone the project
git clone https://github.com/your-username/media-assistant-api.git

# Enter project directory
cd media-assistant-api

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## ✨ Features

- 🎨 Custom Theme Styling
  - Configure fonts, colors, spacing, and other styles
  - Support dark mode switching
  - Multiple preset themes available
  - Support custom CSS style overrides

- 📊 Mermaid Chart Rendering
  - Flowcharts
  - Sequence diagrams
  - Gantt charts
  - Class diagrams and more

- ✍️ KaTeX Math Formula Support
  - Inline formulas
  - Block-level formulas
  - Support for all KaTeX syntax

- 🎯 Custom Alert Boxes
  - Information alerts
  - Warning alerts
  - Error alerts
  - Success alerts

- 💫 Mac-style Code Blocks
  - Code highlighting
  - Line numbers
  - Copy functionality
  - Language identification

- 🔗 Support for footnotes and reference links
- 📱 Responsive design, perfect for mobile devices
- 🎈 Lightweight and easy to deploy

## 🖼️ Preview

![Preview Image](assets/preview.png)

## 📦 API Documentation

### 1. Markdown to HTML

Convert Markdown text to HTML format.

```http
POST /markdown/html
Content-Type: application/json

Request Body:
{
  "data": "# Your Markdown Content",    // Markdown content (required)
  "isMacCodeBlock": true,              // Enable Mac-style code blocks (optional)
  "theme": "classic",                  // Theme name (optional): classic, elegant
  "fontFamily": "sans-serif",          // Font type (optional): sans-serif, serif, monospace
  "fontSize": "15px",                 // Font size: 12px-16px (optional)
  "isUseIndent": true,                // Enable indentation (optional)
  "primaryColor": "#1890ff",          // Primary color (optional)
  "citeStatus": true,                 // Enable citations (optional)
  "legend": "title only",             // Legend style (optional): title priority, alt priority, title only, alt only, none
  "codeTheme":"https://cdn.bootcdn.net/ajax/libs/highlight.js/11.10.0/styles/an-old-hope.min.css"              // Code theme CSS URL
}

Response:
{
  "status": "success",
  "data": {
    "html": "<div class='markdown-body'>...Converted HTML content...</div>"
  }
}
```

### 2. Preview Effect

Get a Markdown preview page with example content.

```http
GET /markdown/preview

Query Parameters:
- isMacCodeBlock: boolean  // Enable Mac-style code blocks
- theme: string           // Theme name
- fontFamily: string      // Font type
- fontSize: string        // Font size
- isUseIndent: boolean    // Enable indentation
- primaryColor: string    // Primary color
- citeStatus: boolean     // Enable citations
- legend: string         // Legend style
- codeTheme: string      // Code theme

Response:
Returns an HTML page with preview content
```

## 🛠️ Project Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000                # Server port
NODE_ENV=development     # Running environment
```

### Theme Configuration

Customize theme styles in `src/config/theme.ts`:

```typescript
export const themes = {
  default: {
    fontSize: '16px',
    lineHeight: '1.6',
    // More style configurations...
  },
  dark: {
    // Dark theme configuration
  }
}
```

## 🤝 Contribution Guide

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Submit a Pull Request

## 📄 License

This project is open-sourced under the [MIT](LICENSE) license.