import { Request, Response, NextFunction } from 'express';
import { MarkdownService } from '@/services/markdown.service';
import { AppError } from '@/middleware/errorHandler';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { MarkdownToHtmlRequest } from '@/types/markdown';
import { config } from '@/config/config';
import { theme } from '@/config/theme';
import { fontFamily, fontSize } from '@/config/style';
import { FontFamilyLabel, FontSizeLabel } from '@/types/index';

export class MarkdownController {
    private static instance: MarkdownController;
    private markdownService!: MarkdownService;
    private readonly templatePath: string;

    private constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        this.templatePath = join(__dirname, "../templates/preview.md");
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

    private stringToFontSizeLabel(value: string): FontSizeLabel {
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
                return config.fontSize as FontSizeLabel;
        }
    }

    private initializeMarkdownService(options: Partial<MarkdownToHtmlRequest>) {
        // 处理字体参数
        let fontFamilyValue = config.fontFamily as FontFamilyLabel;
        if (options.fontFamily) {
            fontFamilyValue = this.stringToFontFamilyLabel(options.fontFamily);
        }

        // 处理字号参数
        let fontSizeValue = config.fontSize as FontSizeLabel;
        if (options.fontSize) {
            fontSizeValue = this.stringToFontSizeLabel(options.fontSize);
        }

        // 初始化 MarkdownService
        this.markdownService = MarkdownService.getInstance({
            theme: theme(options.theme || config.theme),  // 主题
            fonts: fontFamily(fontFamilyValue).value, // 字体
            size: fontSize(fontSizeValue).value,  // 字号
            isUseIndent: options.isUseIndent !== undefined ? options.isUseIndent : config.isUseIndent, // 是否使用缩进
            isMacStyle: options.isMacCodeBlock, // 是否使用mac代码块
            primaryColor: options.primaryColor || config.color,  // 主色调
            citeStatus: options.citeStatus !== undefined ? options.citeStatus : true,  // 是否启用引用
            legend: options.legend || config.legend,  // 图例
            codeTheme: options.codeTheme || config.codeTheme,
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

            this.initializeMarkdownService(options);
            const html = await this.markdownService.render(data);

            res.json({
                status: 'success',
                data: { html }
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
            console.log(req.query.isMacCodeBlock === 'true');

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

            this.initializeMarkdownService(options);
            const html = await this.markdownService.render(previewContent);

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        } catch (error) {
            next(error);
        }
    };
}