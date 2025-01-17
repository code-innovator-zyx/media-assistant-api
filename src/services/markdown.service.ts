import { marked } from 'marked';
import hljs from 'highlight.js';
import { config } from '@/config/index.js';
import { AppError } from '@/middleware/errorHandler.js';

interface ExtendedMarkedOptions {
    breaks?: boolean;
    gfm?: boolean;
    highlight?: (code: string, language: string) => string;
}

interface MarkdownOptions {
    theme?: string;
    enableMermaid?: boolean;
    enableKatex?: boolean;
    enableMacStyle?: boolean;
}

export class MarkdownService {
    private static instance: MarkdownService;

    private constructor() {
        this.initializeMarked();
    }

    public static getInstance(): MarkdownService {
        if (!MarkdownService.instance) {
            MarkdownService.instance = new MarkdownService();
        }
        return MarkdownService.instance;
    }

    private initializeMarked(): void {
        const options: ExtendedMarkedOptions = {
            breaks: true,
            gfm: true,
            highlight: (code: string, lang: string): string => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {
                        console.error('Highlight error:', err);
                    }
                }
                return hljs.highlightAuto(code).value;
            }
        };
        marked.setOptions(options);
    }

    public async convertToHtml(
        markdown: string,
        options: MarkdownOptions = {}
    ): Promise<string> {
        try {
            const mergedOptions = {
                ...config.markdown,
                ...options,
            };

            let html = await marked(markdown);

            // Apply theme
            html = this.applyTheme(html, mergedOptions.theme);

            // Process special features
            if (mergedOptions.enableMermaid) {
                html = await this.processMermaid(html);
            }

            if (mergedOptions.enableKatex) {
                html = await this.processKatex(html);
            }

            if (mergedOptions.enableMacStyle) {
                html = this.applyMacStyle(html);
            }

            return html;
        } catch (error) {
            throw new AppError(500, 'Error converting markdown to HTML');
        }
    }

    private applyTheme(html: string, theme = 'github'): string {
        // Apply theme-specific CSS
        return `<div class="theme-${theme}">${html}</div>`;
    }

    private async processMermaid(html: string): Promise<string> {
        // Process Mermaid diagrams
        // Implementation details here
        return html;
    }

    private async processKatex(html: string): Promise<string> {
        // Process KaTeX equations
        // Implementation details here
        return html;
    }

    private applyMacStyle(html: string): string {
        // Apply Mac-style code blocks
        // Implementation details here
        return html;
    }
} 