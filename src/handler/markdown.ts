import type { MarkdownToHtmlRequest, MarkdownToHtmlResponse } from "@/models/markdown.js";
import { config } from '@/config/config.js'
import { MarkdownService } from "@/services/MarkdownService.js";
import { theme } from "@/config/theme.js";
import { fontFamily, fontSize } from "@/config/style.js";
import { FontFamilyLabel, FontSizeLabel } from "@/types/index.js";

// 将字符串转换为 FontFamilyLabel 枚举
function stringToFontFamilyLabel(value: string): FontFamilyLabel {
  // 检查值是否匹配枚举的值
  switch (value) {
    case "无衬线":
      return FontFamilyLabel.SansSerif;
    case "衬线":
      return FontFamilyLabel.Serif;
    case "等宽":
      return FontFamilyLabel.Monospace;
    default:
      // 如果不匹配任何枚举值，返回默认值
      return config.fontFamily as FontFamilyLabel;
  }
}

// 将字符串转换为 FontSizeLabel 枚举
function stringToFontSizeLabel(value: string): FontSizeLabel {
  // 检查值是否匹配枚举的值
  switch (value) {
    case "12px":
      return FontSizeLabel.XXSmall;
    case "13px":
      return FontSizeLabel.XSmall;
    case "14px":
      return FontSizeLabel.Small;
    case "15px":
      return FontSizeLabel.Medium;
    case "16px":
      return FontSizeLabel.Large;
    default:
      // 如果不匹配任何枚举值，返回默认值
      return config.fontSize as FontSizeLabel;
  }
}

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
    // 处理字体参数
    let fontFamilyValue = config.fontFamily as FontFamilyLabel;
    if (request.fontFamily) {
      fontFamilyValue = stringToFontFamilyLabel(request.fontFamily);
    }

    // 处理字号参数
    let fontSizeValue = config.fontSize as FontSizeLabel;
    if (request.fontSize) {
      fontSizeValue = stringToFontSizeLabel(request.fontSize);
    }

    // 初始化 MarkdownService
    const markdownService = MarkdownService.getInstance({
      theme: theme(request.theme || config.theme),  // 主题
      fonts: fontFamily(fontFamilyValue).value, // 字体
      size: fontSize(fontSizeValue).value,  // 字号
      isUseIndent: request.isUseIndent !== undefined ? request.isUseIndent : config.isUseIndent, // 是否使用缩进
      isMacStyle: request.isMacCodeBlock, // 是否使用mac代码块
      primaryColor: request.primaryColor || config.color,  // 主色调
      citeStatus: request.citeStatus !== undefined ? request.citeStatus : true,  // 是否启用引用
      legend: request.legend || config.legend,  // 图例
      codeTheme: request.codeTheme || config.codeTheme,
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