import type { MarkdownToHtmlRequest, MarkdownToHtmlResponse } from "@/models/markdown.js";
import { marked } from "marked";
import { initRenderer } from "@/utils/renderer.js";
import { customCssWithTemplate, css2json, customizeTheme } from "@/utils/index.js";
import { themeMap } from "@/config/theme.js";
import fs from 'node:fs'
import path from 'node:path'
const render = initRenderer({
  theme: customCssWithTemplate(css2json(`{"active":"方案 1","tabs":[{"title":"方案 1","name":"方案 1","content":"/**\n * 按 Alt/Option + Shift + F 可格式化\n * 如需使用主题色，请使用 var(--md-primary-color) 代替颜色值\n * 如：color: var(--md-primary-color);\n *\n * 召集令：如果你有好看的主题样式，欢迎分享，让更多人能够使用到你的主题。\n * 提交区：https://github.com/doocs/md/discussions/426\n */\n/* 顶层容器样式 */\ncontainer {\n}\n/* 一级标题样式 */\nh1 {\n}\n/* 二级标题样式 */\nh2 {\n}\n/* 三级标题样式 */\nh3 {\n}\n/* 四级标题样式 */\nh4 {\n}\n/* 五级标题样式 */\nh5 {\n}\n/* 六级标题样式 */\nh6 {\n}\n/* 图片样式 */\nimage {\n}\n/* 引用样式 */\nblockquote {\n}\n/* 引用段落样式 */\nblockquote_p {\n}\n/* GFM note 样式 */\nblockquote_note {\n}\n/* GFM tip 样式 */\nblockquote_tip {\n}\n/* GFM important 样式 */\nblockquote_important {\n}\n/* GFM warning 样式 */\nblockquote_warning {\n}\n/* GFM caution 样式 */\nblockquote_caution {\n}\n/* GFM 通用标题 */\nblockquote_title {\n}\n/* GFM note 标题 */\nblockquote_title_note {\n}\n/* GFM tip 标题 */\nblockquote_title_tip {\n}\n/* GFM important 标题 */\nblockquote_title_important {\n}\n/* GFM warning 标题 */\nblockquote_title_warning {\n}\n/* GFM caution 标题 */\nblockquote_title_caution {\n}\n/* GFM note 段落样式 */\nblockquote_p_note {\n}\n/* GFM tip 段落样式 */\nblockquote_p_tip {\n}\n/* GFM important 段落样式 */\nblockquote_p_important {\n}\n/* GFM warning 段落样式 */\nblockquote_p_warning {\n}\n/* GFM caution 段落样式 */\nblockquote_p_caution {\n}\n/* 段落样式 */\np {\n}\n/* 分割线样式 */\nhr {\n}\n/* 行内代码样式 */\ncodespan {\n}\n/* 粗体样式 */\nstrong {\n}\n/* 链接样式 */\nlink {\n}\n/* 微信链接样式 */\nwx_link {\n}\n/* 有序列表样式 */\nol {\n}\n/* 无序列表样式 */\nul {\n}\n/* 列表项样式 */\nli {\n}\n/* 代码块样式 */\ncode {\n}\n/* 代码块外层样式 */\ncode_pre {\n}\n"}]}`), `#0F4C81`, customizeTheme(themeMap.grace, { fontSize: 14, color: `#0F4C81` })),
  fonts: `Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif`,
  size: `14px`,
  isUseIndent: false,
});
render.reset({ citeStatus: false, legend: `title`, isUseIndent: false, countStatus: false })


// 将markdown转换为html
async function markdownToHtml(request: MarkdownToHtmlRequest): Promise<MarkdownToHtmlResponse> {
  if (request.data.length == 0) {
    return {
      html: "",
      code: 400,
      message: "invalid parameter:data is empty"
    }
  }
  let html = marked.parse(request.data) as string;
  // 去除第一行的 margin-top
  html = html.replace(/(style=".*?)"/, `$1;margin-top: 0"`)

  html += buildAddition();
  // 是否是mac代码块
  html += buildMacCodeBlock(request.isMacCodeBlock);
  html += `
    <style>
      .code__pre {
        padding: 0 !important;
      }
  
      .hljs.code__pre code {
        display: -webkit-box;
        padding: 0.5em 1em 1em;
        overflow-x: auto;
        text-indent: 0;
      }
    </style>
  `

  html = render.createContainer(html)
  return {
    html: render.exportHTML(html, '#0F4C81'),
    code: 200,
    message: "success"
  }
}

// 保存 HTML 到本地文件
function saveToFile(outputTemp: string, fileName: string) {
  const filePath = path.join(`./`, fileName) // 保存文件路径

  // 使用 fs 模块将 outputTemp 保存为 HTML 文件
  fs.writeFileSync(filePath, outputTemp, `utf8`)
  console.log(`File saved to ${filePath}`)
}
function buildAddition(): string {
  return `
      <style>
        .preview-wrapper pre::before {
          position: absolute;
          top: 0;
          right: 0;
          color: #ccc;
          text-align: center;
          font-size: 0.8em;
          padding: 5px 10px 0;
          line-height: 15px;
          height: 15px;
          font-weight: 600;
        }
      </style>
    `
}


function buildMacCodeBlock(isMacCodeBlock: boolean) {
  if (isMacCodeBlock) {
    return `
    <style>
      .hljs.code__pre > .mac-sign {
        display: flex;
      }
    </style>
  `
  }
  return ``
}
export { markdownToHtml }