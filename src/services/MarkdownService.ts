import { marked, RendererObject, Tokens, Parser } from "marked";
import { MDKatex } from '@/utils/MDKatex.js';
import markedAlert from "@/utils/MDAlert.js";
import { ThemeStyles, IOpts, ExtendedProperties } from "@/types/index.js";
import { escapeHtml, getStyles } from "@/utils/helpers.js";
import { mermaidRenderer } from "./renderers/MermaidRenderer";
import { codeRenderer } from "./renderers/CodeRenderer.js";
import { cloneDeep, toMerged } from "es-toolkit";
import type { PropertiesHyphen } from 'csstype';
import frontMatter from 'front-matter';
import { JSDOM } from 'jsdom';

export class MarkdownService {
    private static instance: MarkdownService;
    private static codeThemeStylesCache: Map<string, string> = new Map();
    private footnotes: [number, string, string][] = [];
    private footnoteIndex: number = 0;
    private styleMapping: ThemeStyles;
    private codeIndex: number = 0;
    private listIndex: number = 0;
    private isOrdered: boolean = false;
    private opts: IOpts;
    private dom: JSDOM;
    private buildTheme({ theme: _theme, fonts, size, isUseIndent, primaryColor }: IOpts): ThemeStyles {
        const theme = cloneDeep(_theme);
        const base = toMerged(theme.base, {
            'font-family': fonts,
            'font-size': size,
            '--md-primary-color': primaryColor
        });
        if (isUseIndent) {
            theme.block.p = {
                'text-indent': `2em`,
                ...theme.block.p,
            }
        }
        const mergeStyles = (styles: Record<string, PropertiesHyphen>): Record<string, ExtendedProperties> =>
            Object.fromEntries(
                Object.entries(styles).map(([ele, style]) => [ele, toMerged(base, style)]),
            )
        return {
            ...mergeStyles(theme.inline),
            ...mergeStyles(theme.block),
        } as ThemeStyles
    }

    private constructor(options: IOpts) {
        this.opts = options;
        this.styleMapping = this.buildTheme(options);
        this.dom = new JSDOM(`<!DOCTYPE html><html><body><div id="output"></div></body></html>`);
        this.initializeMarked();
    }

    public static getInstance(options: IOpts): MarkdownService {
        if (!MarkdownService.instance) {
            console.log("new instance");
            MarkdownService.instance = new MarkdownService(options);
        } else {
            // 更新现有实例的配置
            MarkdownService.instance.updateConfig(options);
        }
        return MarkdownService.instance;
    }

    // 添加更新配置的方法
    private updateConfig(options: IOpts): void {
        this.opts = options;
        this.styleMapping = this.buildTheme(options);
        this.initializeMarked(); // 重新初始化 marked 以应用新的样式
        this.footnotes = [];
        this.footnoteIndex = 0;
        this.codeIndex = 0;
        this.listIndex = 0;
    }

    private initializeMarked(): void {
        marked.setOptions({
            breaks: true,
        });
        marked.use(MDKatex({ nonStandard: true }));
        marked.use({ renderer: this.createRenderer() });
        marked.use(markedAlert({ styles: this.styleMapping }));

        // 添加 Mac 风格代码块
        if (this.opts.isMacStyle) {
            const macStyle = `
                <style>
                    .hljs.code__pre > .mac-sign {
                        display: flex;
                    }
                    .code__pre {
                        padding: 0 !important;
                    }
                    .hljs.code__pre code {
                        display: -webkit-box;
                        padding: 0.5em 1em 1em;
                        overflow-x: auto;
                        text-indent: 0;
                        white-space: nowrap;
                    }
                </style>
            `;
            marked.use({
                hooks: {
                    postprocess(html) {
                        return html + macStyle;
                    }
                }
            });
        }
    }
    private blockquoteRenderer({ tokens }: Tokens.Blockquote): string {
        const text = Parser.parse(tokens);
        const styledText = text.replace(/<p .*?>/g, `<p ${this.getStyles('blockquote_p')}>`);
        return this.styledContent('blockquote', styledText);
    }

    private codespanRenderer({ text }: Tokens.Codespan): string {
        const escapedText = escapeHtml(text);
        return this.styledContent('codespan', escapedText, 'code');
    }

    private listitemRenderer(item: Tokens.ListItem): string {
        const prefix = this.isOrdered ? `${this.listIndex + 1}. ` : '• ';
        const content = Parser.parseInline(item.tokens);
        return this.styledContent('listitem', `${prefix}${content}`, 'li');
    }

    private listRenderer({ ordered, items, start = 1 }: Tokens.List): string {
        const listItems = [];
        for (let i = 0; i < items.length; i++) {
            this.isOrdered = ordered;
            this.listIndex = Number(start) + i - 1;
            const item = items[i];
            listItems.push(this.listitemRenderer(item));
        }
        const label = ordered ? 'ol' : 'ul';
        return this.styledContent(label, listItems.join(''));
    }
    private strongRenderer({ tokens }: Tokens.Strong): string {
        return this.styledContent('strong', Parser.parseInline(tokens));
    }

    private emRenderer({ tokens }: Tokens.Em): string {
        return this.styledContent('em', Parser.parseInline(tokens), 'span');
    }

    private tableRenderer({ header, rows }: Tokens.Table): string {
        const headerRow = header
            .map(cell => this.tablecellRenderer(cell))
            .join('');
        const body = rows
            .map((row) => {
                const rowContent = row
                    .map(cell => this.tablecellRenderer(cell))
                    .join('');
                return this.styledContent('tr', rowContent);
            })
            .join('');
        return `
            <section style="padding:0 8px; max-width: 100%; overflow: auto">
                <table class="preview-table">
                    <thead ${this.getStyles('thead')}>${headerRow}</thead>
                    <tbody>${body}</tbody>
                </table>
            </section>
        `;
    }

    private tablecellRenderer(token: Tokens.TableCell): string {
        const text = Parser.parseInline(token.tokens);
        return this.styledContent('td', text);
    }

    private hrRenderer(_: Tokens.Hr): string {
        return this.styledContent('hr', '');
    }

    private createRenderer(): RendererObject {
        return {
            heading: this.headingRenderer.bind(this),
            paragraph: this.paragraphRenderer.bind(this),
            blockquote: this.blockquoteRenderer.bind(this),
            code: this.codeRenderer.bind(this),
            codespan: this.codespanRenderer.bind(this),
            listitem: this.listitemRenderer.bind(this),
            list: this.listRenderer.bind(this),
            image: this.imageRenderer.bind(this),
            link: this.linkRenderer.bind(this),
            strong: this.strongRenderer.bind(this),
            em: this.emRenderer.bind(this),
            table: this.tableRenderer.bind(this),
            tablecell: this.tablecellRenderer.bind(this),
            hr: this.hrRenderer.bind(this)
        };
    }

    private headingRenderer({ tokens, depth }: Tokens.Heading): string {
        const text = Parser.parseInline(tokens);
        const tag = `h${depth}`;
        return this.styledContent(tag, text);
    }

    private paragraphRenderer({ tokens }: Tokens.Paragraph): string {
        const text = Parser.parseInline(tokens);
        if (this.isSpecialParagraph(text)) {
            return text;
        }
        return this.styledContent('p', text);
    }

    private codeRenderer({ text, lang = '' }: Tokens.Code): string {
        if (lang.startsWith('mermaid')) {
            return mermaidRenderer(text, this.codeIndex++);
        }
        return codeRenderer(text, lang, this.styleMapping);
    }

    private linkRenderer({ href, title, text, tokens }: Tokens.Link): string {
        const parsedText = Parser.parseInline(tokens);
        if (this.isWeixinLink(href)) {
            return this.renderWeixinLink(href, title || null, text, parsedText);
        }
        return this.renderStandardLink(href, title || null, text, parsedText);
    }

    private imageRenderer({ href, title, text }: Tokens.Image): string {
        return this.renderImage(href, title, text);
    }

    // Helper methods
    private styledContent(styleLabel: string, content: string, tagName?: string): string {
        const tag = tagName ?? styleLabel;
        const styles = this.getStyles(styleLabel);
        return `<${tag} ${styles}>${content}</${tag}>`;
    }

    private getStyles(tokenName: string, addition: string = ''): string {
        return getStyles(this.styleMapping, tokenName, addition);
    }

    private isSpecialParagraph(text: string): boolean {
        return text.includes('<figure') && text.includes('<img');
    }

    private isWeixinLink(href: string): boolean {
        return href.startsWith('https://mp.weixin.qq.com');
    }

    private renderWeixinLink(href: string, title: string | null, text: string, parsedText: string): string {
        return `<a href="${href}" title="${title || text}" ${this.getStyles('wx_link')}>${parsedText}</a>`;
    }

    private renderStandardLink(href: string, title: string | null, text: string, parsedText: string): string {
        if (href === text) {
            return parsedText;
        }
        return this.styledContent('link', parsedText, 'span');
    }

    private renderImage(href: string, title: string | null, text: string): string {
        const imgStyles = this.getStyles('image');
        const figureStyles = this.getStyles('figure');
        const caption = title || text;
        const figcaption = caption ? this.styledContent('figcaption', caption) : '';
        return `<figure ${figureStyles}><img ${imgStyles} src="${href}" title="${title || ''}" alt="${text}"/>${figcaption}</figure>`;
    }

    public parseFrontMatterAndContent(markdownText: string) {
        try {
            const parsed = frontMatter(markdownText);
            return {
                yamlData: parsed.attributes,
                markdownContent: parsed.body
            };
        } catch (error) {
            console.error('Error parsing front-matter:', error);
            return {
                yamlData: {},
                markdownContent: markdownText
            };
        }
    }

    public buildFootnotes(): string {
        if (!this.footnotes.length) {
            return '';
        }
        const footnoteItems = this.footnotes
            .map(([index, title, link]) =>
                link === title
                    ? `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code>: <i style="word-break: break-all">${title}</i><br/>`
                    : `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code> ${title}: <i style="word-break: break-all">${link}</i><br/>`
            )
            .join('\n');

        return this.styledContent('h4', '引用链接') +
            this.styledContent('footnotes', footnoteItems, 'p');
    }

    public buildAddition(): string {
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
        `;
    }

    public async exportHTML(htmlContent: string, primaryColor: string): Promise<string> {
        const document = this.dom.window.document;
        document.querySelector('#output')!.innerHTML = htmlContent;
        const element = document.querySelector('#output')!;

        // 处理颜色变量
        const htmlStr = element.innerHTML
            .replaceAll('var(--md-primary-color)', primaryColor)
            .replaceAll(/--md-primary-color:.+?;/g, '');

        // 下载并内联样式，使用缓存
        let codeThemeStyles = '';
        try {
            if (this.opts.codeTheme) {
                // 检查缓存中是否已有该主题样式
                if (MarkdownService.codeThemeStylesCache.has(this.opts.codeTheme)) {
                    codeThemeStyles = MarkdownService.codeThemeStylesCache.get(this.opts.codeTheme) || '';
                    console.log('Using cached code theme styles');
                } else {
                    // 如果缓存中没有，则下载并缓存
                    const response = await fetch(this.opts.codeTheme);
                    codeThemeStyles = await response.text();
                    MarkdownService.codeThemeStylesCache.set(this.opts.codeTheme, codeThemeStyles);
                    console.log('Downloaded and cached code theme styles');
                }
            }
        } catch (error) {
            console.error('Error fetching code theme styles:', error);
        }

        return `<html><head>
            <meta charset="utf-8" />
            <style>${codeThemeStyles}</style>
            </head>
            <body><div style="width: 750px; margin: auto;">${htmlStr}</div></body></html>`;
    }

    // Public methods
    public async render(markdown: string): Promise<string> {
        const { markdownContent } = this.parseFrontMatterAndContent(markdown);
        let outputTemp = await marked(markdownContent);

        // 去除第一行的 margin-top
        outputTemp = outputTemp.replace(/(style=".*?)"/, `$1;margin-top: 0"`);

        // 引用脚注
        outputTemp += this.buildFootnotes();

        // 附加的一些 style
        outputTemp += this.buildAddition();

        // Mac 风格代码块样式
        if (this.opts.isMacStyle) {
            outputTemp += `
                <style>
                    .hljs.code__pre > .mac-sign {
                        display: flex;
                    }
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
            `;
        }

        outputTemp = this.wrapWithContainer(outputTemp);
        return this.exportHTML(outputTemp, this.opts.primaryColor || '');
    }

    public reset(newOpts: Partial<IOpts>): void {
        this.footnotes = [];
        this.footnoteIndex = 0;
        this.opts = { ...this.opts, ...newOpts };
        this.styleMapping = this.buildTheme(this.opts);
    }

    private wrapWithContainer(content: string): string {
        return this.styledContent('container', content, 'section');
    }
}