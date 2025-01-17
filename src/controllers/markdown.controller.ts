import { Request, Response, NextFunction } from 'express';
import { MarkdownService } from '@/services/markdown.service.js';
import { AppError } from '@/middleware/errorHandler.js';

export class MarkdownController {
    private static instance: MarkdownController;
    private markdownService: MarkdownService;

    private constructor() {
        this.markdownService = MarkdownService.getInstance();
    }

    public static getInstance(): MarkdownController {
        if (!MarkdownController.instance) {
            MarkdownController.instance = new MarkdownController();
        }
        return MarkdownController.instance;
    }

    public convertToHtml = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { markdown, options } = req.body;

            if (!markdown) {
                throw new AppError(400, 'Markdown content is required');
            }

            const html = await this.markdownService.convertToHtml(markdown, options);

            res.json({
                status: 'success',
                data: {
                    html,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    public getExample = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const exampleMarkdown = `# Example Markdown
## Features
- Supports **bold** and *italic* text
- Code blocks with syntax highlighting
\`\`\`javascript
console.log('Hello World!');
\`\`\`
- And much more!`;

            const html = await this.markdownService.convertToHtml(exampleMarkdown);

            res.json({
                status: 'success',
                data: {
                    markdown: exampleMarkdown,
                    html,
                },
            });
        } catch (error) {
            next(error);
        }
    };
} 