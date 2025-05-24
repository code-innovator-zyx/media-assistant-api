import { Request, Response, NextFunction } from 'express';
import { MarkdownService } from '@/services/markdown.service.js';
import { AppError } from '@/middleware/errorHandler.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { MarkdownToHtmlRequest } from '@/types/markdown.js';
import { config } from '@/config/config.js';
import { theme } from '@/config/theme.js';
import { fontFamily, fontSize, codeBlockTheme } from '@/config/style.js';
import { FontFamilyLabel, FontSizeLabel } from '@/types/index.js';
import { css2json, customCssWithTemplate, customizeTheme } from "@/utils/index.js"

export class MarkdownController {
    private static codeThemeStylesCache: Map<string, string> = new Map();
    private static instance: MarkdownController;
    private markdownService!: MarkdownService;
    private readonly templatePath: string;
    private cssContent: string;
    private constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        this.templatePath = join(__dirname, "../templates/preview.md");
        this.cssContent = readFileSync(join(__dirname, "../config/style.css"), "utf-8")
    }
    private async getCodeTheme(codeTheme: string): Promise<string> {
        //下载并内联样式，使用缓存
        try {
            // 检查缓存中是否已有该主题样式
            if (MarkdownController.codeThemeStylesCache.has(codeTheme)) {
                return MarkdownController.codeThemeStylesCache.get(codeTheme) || '';
            } else {
                // 如果缓存中没有，则下载并缓存
                const response = await fetch(codeBlockTheme(codeTheme));
                const codeThemeStyles = await response.text();
                MarkdownController.codeThemeStylesCache.set(codeTheme, codeThemeStyles);
                console.log('Downloaded and cached code theme styles %s', codeTheme);
                return codeThemeStyles;
            }
        } catch (error) {
            console.error('Error fetching code theme styles:', error);
            return ''; // 发生错误时返回空字符串
        }
    }

    public static getInstance(): MarkdownController {
        if (!MarkdownController.instance) {
            MarkdownController.instance = new MarkdownController();
        }
        return MarkdownController.instance;
    }

    private stringToFontFamilyLabel(value: string): FontFamilyLabel {
        switch (value) {
            case "无衬线":
                return FontFamilyLabel.SansSerif;
            case "衬线":
                return FontFamilyLabel.Serif;
            case "等宽":
                return FontFamilyLabel.Monospace;
            default:
                return config.fontFamily as FontFamilyLabel;
        }
    }

    private stringToFontSizeLabel(value: string): FontSizeLabel | string {
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
                // 检查是否是有效的像素值（如：18px）
                if (/^\d+px$/.test(value)) {
                    return value;
                }
                return config.fontSize as FontSizeLabel;
        }
    }

    private async initializeMarkdownService(options: Partial<MarkdownToHtmlRequest>) {
        // 处理字体参数
        let fontFamilyValue = config.fontFamily as FontFamilyLabel;
        if (options.fontFamily) {
            fontFamilyValue = this.stringToFontFamilyLabel(options.fontFamily);
        }

        // 处理字号参数
        let fontSizeValue = config.fontSize as FontSizeLabel;
        if (options.fontSize) {
            const sizeValue = this.stringToFontSizeLabel(options.fontSize);
            fontSizeValue = sizeValue as FontSizeLabel;
        }
        const primaryColor = options.primaryColor || config.color
        const fontSizeNumber = Number(fontSizeValue.replace(`px`, ``))
        const codeThemeCss = await this.getCodeTheme(options.codeTheme || config.codeTheme)
        // 初始化 MarkdownService
        this.markdownService = MarkdownService.getInstance({
            theme: customCssWithTemplate(css2json(this.cssContent + codeThemeCss),
                primaryColor, customizeTheme(theme(options.theme || config.theme),
                    { fontSize: fontSizeNumber, color: primaryColor })),  // 主题
            fonts: fontFamily(fontFamilyValue).value, // 字体
            size: fontSize(fontSizeValue).value,  // 字号
            isUseIndent: options.isUseIndent !== undefined ? options.isUseIndent : config.isUseIndent, // 是否使用缩进
            isMacStyle: options.isMacCodeBlock, // 是否使用mac代码块
            primaryColor: primaryColor,  // 主色调
            citeStatus: options.citeStatus !== undefined ? options.citeStatus : true,  // 是否启用引用
            legend: options.legend || config.legend,  // 图例
            codeTheme: codeBlockTheme(options.codeTheme || config.codeTheme),
        });
    }

    public convertToHtml = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { data, ...options } = req.body;

            if (!data || data.length === 0) {
                throw new AppError(400, 'Markdown content is required');
            }

            await this.initializeMarkdownService(options);
            const html = await this.markdownService.render(data);

            res.json({
                status: 'success',
                data: html
            });
        } catch (error) {
            next(error);
        }
    };

    public preview = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const previewContent = readFileSync(this.templatePath, "utf-8");
            if (!previewContent) {
                throw new AppError(500, 'Failed to load preview template');
            }
            const options = {
                isMacCodeBlock: req.query.isMacCodeBlock === 'true',
                theme: req.query.theme as string,
                fontFamily: req.query.fontFamily as string,
                fontSize: req.query.fontSize as string,
                isUseIndent: req.query.isUseIndent === 'true',
                primaryColor: req.query.primaryColor as string,
                citeStatus: req.query.citeStatus === 'true',
                legend: req.query.legend as string,
                codeTheme: req.query.codeTheme as string
            };

            // 移除所有未定义的属性
            Object.keys(options).forEach(key => {
                if (options[key as keyof typeof options] === undefined) {
                    delete options[key as keyof typeof options];
                }
            });

            await this.initializeMarkdownService(options);
            const html = await this.markdownService.render(previewContent);

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        } catch (error) {
            next(error);
        }
    };
}