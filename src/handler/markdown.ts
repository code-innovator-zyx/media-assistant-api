import type { MarkdownToHtmlRequest, MarkdownToHtmlResponse } from "@/models/markdown.js";
import { config } from '@/config/config.js'
import { MarkdownService } from "@/services/MarkdownService.js";
import { theme } from "@/config/theme.js";
import { fontFamily, fontSize } from "@/config/style.js";
import { FontFamilyLabel, FontSizeLabel } from "@/types/index.js";

// 将markdown转换为html (使用新的 MarkdownService)
async function markdownToHtml(request: MarkdownToHtmlRequest): Promise<MarkdownToHtmlResponse> {
  if (request.data.length == 0) {
    return {
      html: "",
      code: 400,
      message: "invalid parameter:data is empty"
    }
  }

  try {
    // 初始化 MarkdownService
    const markdownService = MarkdownService.getInstance({
      theme: theme(config.theme),  // 主题
      fonts: fontFamily(config.fontFamily as FontFamilyLabel).value, // 字体
      size: fontSize(config.fontSize as FontSizeLabel).value,  // 字号
      isUseIndent: config.isUseIndent, // 是否使用缩进
      isMacStyle: request.isMacCodeBlock, // 是否使用mac代码块
      primaryColor: config.color,  // 主色调
      citeStatus: true,  // 是否启用引用
      legend: config.legend,  // 图例
      codeTheme: config.codeTheme,
    });

    // 转换 Markdown 到 HTML
    const html = await markdownService.render(request.data);

    return {
      html,
      code: 200,
      message: "success"
    };
  } catch (error) {
    return {
      html: "",
      code: 500,
      message: `Error converting markdown: ${error}`
    };
  }
}

export { markdownToHtml }