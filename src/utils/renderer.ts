import { marked, RendererObject, Tokens } from "marked";
import type { PropertiesHyphen } from 'csstype'
import {MDKatex} from './MDKatex.js'
import type { IOpts, ThemeStyles, ExtendedProperties } from "@/types/index.js";
import { cloneDeep, toMerged } from "es-toolkit";
import { getStyleString } from "./index.js";
import mermaid from 'mermaid'
import hljs from 'highlight.js'
import markedAlert from "./MDAlert.js"


/**
 *  markdown 渲染器
 * 将markdown 转换为html
 */
marked.setOptions({
    breaks: true, // 允许换行
});
marked.use(MDKatex({ nonStandard: true }));// 启用 KaTeX 数学公式支持

// 基于传入的主题、字体和尺寸生成完整的样式配置
function buildTheme({ theme: _theme, fonts, size, isUseIndent }: IOpts): ThemeStyles {
    const theme = cloneDeep(_theme);   // 拷贝主题，防止修改源数据
    //  设置基础样式
    const base = toMerged(theme.base, {
        'font-family': fonts,
        'font-size': size,
    });
    // 根据 isUseIndent 决定是否为段落添加缩进
    if (isUseIndent) {
        theme.block.p = {
            'text-indent': `2em`,
            ...theme.block.p,
        }
    }
    // 合并样式
    const mergeStyles = (styles: Record<string, PropertiesHyphen>): Record<string, ExtendedProperties> =>
        Object.fromEntries(
            Object.entries(styles).map(([ele, style]) => [ele, toMerged(base, style)]),
        )
    return {
        ...mergeStyles(theme.inline),
        ...mergeStyles(theme.block),
    } as ThemeStyles
}

// 转义 HTML 字符
function escapeHtml(text: string): string {
    // 对特殊字符进行转义
    return text
        .replace(/&/g, `&amp;`) // 转义 &
        .replace(/</g, `&lt;`) // 转义 <
        .replace(/>/g, `&gt;`) // 转义 >
        .replace(/"/g, `&quot;`) // 转义 "
        .replace(/'/g, `&#39;`) // 转义 '
        .replace(/`/g, `&#96;`) // 转义 `
}

// 生成额外的全局样式（如代码块的顶部标记）。
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

function getStyles(styleMapping: ThemeStyles, tokenName: string, addition: string = ``): string {
    const dict = styleMapping[tokenName as keyof ThemeStyles]
    if (!dict) {
        return ``
    }
    const styles = getStyleString(dict)
    return `style="${styles}${addition}"`
}

// 格式化脚注数组为 HTML 列表。
function buildFootnoteArray(footnotes: [number, string, string][]): string {
    return footnotes
        .map(([index, title, link]) =>
            link === title
                ? `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code>: <i style="word-break: break-all">${title}</i><br/>`
                : `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code> ${title}: <i style="word-break: break-all">${link}</i><br/>`,
        )
        .join(`\n`)
}
function transform(legend: string, text: string | null, title: string | null): string {
    const options = legend.split(`-`)
    for (const option of options) {
        if (option === `alt` && text) {
            return text
        }
        if (option === `title` && title) {
            return title
        }
    }
    return ``
}

const macCodeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="45px" height="13px" viewBox="0 0 450 130">
    <ellipse cx="50" cy="65" rx="50" ry="52" stroke="rgb(220,60,54)" stroke-width="2" fill="rgb(237,108,96)" />
    <ellipse cx="225" cy="65" rx="50" ry="52" stroke="rgb(218,151,33)" stroke-width="2" fill="rgb(247,193,81)" />
    <ellipse cx="400" cy="65" rx="50" ry="52" stroke="rgb(27,161,37)" stroke-width="2" fill="rgb(100,200,86)" />
  </svg>
`.trim()


// 初始化自定义渲染器
export function initRenderer(opts: IOpts) {
    // 存储脚注的数组  【索引、标题、链接】
    const footnotes: [number, string, string][] = []
    // 脚注的当前索引
    let footnoteIndex: number = 0
    // 保存基于主题选项生成的样式映射表，通过调用buildTheme初始化
    let styleMapping: ThemeStyles = buildTheme(opts)
    // 代码块计数器
    let codeIndex: number = 0
    // 有序列表当前的索引。
    let listIndex: number = 0
    // 标记当前是否在处理有序列表
    let isOrdered: boolean = false

    /**
     * 生成 HTML 标签对应的样式字符串。
     * @param tag html 标签名称
     * @param addition 额外样式(可选)
     * @returns 
     */
    function styles(tag: string, addition: string = ``): string {
        return getStyles(styleMapping, tag, addition)
    }

    /**
     * 生成带样式的 HTML 标签。
     * @param styleLabel 样式标签名称
     * @param content 标签内容
     * @param tagName 可选的 HTML 标签名称，默认与styleLabel 一致
     * @returns 
     */
    function styledContent(styleLabel: string, content: string, tagName?: string): string {
        const tag = tagName ?? styleLabel
        return `<${tag} ${styles(styleLabel)}>${content}</${tag}>`
    }

    /**
     * 添加脚注到 数组中
     * @param title 标题
     * @param link 链接
     * @returns 脚注的索引 
     */
    function addFootnote(title: string, link: string): number {
        // 添加新的脚注并返回索引
        footnotes.push([++footnoteIndex, title, link])
        return footnoteIndex
    }
    /**
     * 更新渲染器选项，重置样式映射关系
     * @param newOpts
     */
    function setOptions(newOpts: Partial<IOpts>): void {
        opts = { ...opts, ...newOpts }
        styleMapping = buildTheme(opts)
        // 使用新的样式
        marked.use(markedAlert({ styles: styleMapping }))
    }
    /**
     * 重置渲染器
     * @param newOpts 
     */
    function reset(newOpts: Partial<IOpts>): void {
        footnotes.length = 0
        footnoteIndex = 0
        setOptions(newOpts)
    }
    const buildFootnotes = () => {
        if (!footnotes.length) {
            return ``
        }

        return (
            styledContent(`h4`, `引用链接`)
            + styledContent(`footnotes`, buildFootnoteArray(footnotes), `p`)
        )
    }


    // 添加代码主题样式链接
    function getCodeThemeStyleLink(theme: string): string {
        return `<link rel="stylesheet" type="text/css" id="hljs" href="${theme}">`
    }
    function exportHTML(htmlContent: string, primaryColor: string): string {
        // 处理颜色变量
        const processedHtml = htmlContent
            .replaceAll(`var(--md-primary-color)`, primaryColor)
            .replaceAll(/--md-primary-color:.+?;/g, ``)

        // 添加代码主题样式（这里使用一个默认主题，你可以通过参数传入）
        const codeTheme = `https://cdn.bootcdn.net/ajax/libs/highlight.js/11.10.0/styles/a11y-dark.min.css`
        const styleLink = getCodeThemeStyleLink(codeTheme)

        // 返回完整的 HTML 文档
        return `<html><head>
        <meta charset="utf-8" />
        ${styleLink}
        </head>
        <body><div style="width: 750px; margin: auto;">${processedHtml}</div></body></html>`
    }

    // 重写渲染器对象
    const renderer: RendererObject = {
        // 标题渲染器  如 #、##  ，depth 决定标题级别  如 h1,h2
        heading({ tokens, depth }: Tokens.Heading) {
            const text = this.parser.parseInline(tokens)
            const tag = `h${depth}`
            return styledContent(tag, text)
        },

        // 段落渲染器
        paragraph({ tokens }: Tokens.Paragraph): string {
            const text = this.parser.parseInline(tokens)
            const isFigureImage = text.includes(`<figure`) && text.includes(`<img`)
            const isEmpty = text.trim() === ``
            if (isFigureImage || isEmpty) {
                return text
            }
            return styledContent(`p`, text)
        },

        blockquote({ tokens }: Tokens.Blockquote): string {
            let text = this.parser.parse(tokens)
            text = text.replace(/<p .*?>/g, `<p ${styles(`blockquote_p`)}>`)
            return styledContent(`blockquote`, text)
        },

        // 3.代码块渲染
        code({ text, lang = `` }: Tokens.Code): string {
            // mermaid 图表处理
            if (lang.startsWith(`mermaid`)) {
                const svg = mermaid.render(`mermaid-diagram-${codeIndex++}`, text)
                return `<pre class="mermaid">${svg}</pre>`
            }
            // 代码高亮
            const langText = lang.split(` `)[0]
            const language = hljs.getLanguage(langText) ? langText : `plaintext`
            let highlighted = hljs.highlight(text, { language }).value

            // 格式化
            highlighted = highlighted.replace(/\t/g, `    `) // 制表符转空格
            highlighted = highlighted
                .replace(/\r\n/g, `<br/>`) // windows 换行符
                .replace(/\n/g, `<br/>`) // unix 换行符
                .replace(/(>[^<]+)|(^[^<]+)/g, str => str.replace(/\s/g, `&nbsp;`))  // 处理空格

            // 添加mac风格ui和代码包装
            const span = `<span class="mac-sign" style="padding: 10px 14px 0;" hidden>${macCodeSvg}</span>`
            const code = `<code class="language-${lang}" ${styles(`code`)}>${highlighted}</code>`
            return `<pre class="hljs code__pre" ${styles(`code_pre`)}>${span}${code}</pre>`
        },

        codespan({ text }: Tokens.Codespan): string {
            const escapedText = escapeHtml(text)
            return styledContent(`codespan`, escapedText, `code`)
        },

        // 5  
        listitem(item: Tokens.ListItem): string {
            const prefix = isOrdered ? `${listIndex + 1}. ` : `• `
            const content = item.tokens.map(t => {
                const handler = (this as any)[t.type];
                return handler.call(this, t);
            }).join(``)
            return styledContent(`listitem`, `${prefix}${content}`, `li`)
        },

        // 4.渲染列表
        list({ ordered, items, start = 1 }: Tokens.List): string {
            const listItems = []  // 存储列表项
            for (let i = 0; i < items.length; i++) {
                isOrdered = ordered  // 更新全局状态，标记是否为有序列表
                listIndex = Number(start) + i - 1  // 计算当前列表项的索引
                const item = items[i]// 获取当前列表项
                listItems.push(this.listitem(item)) // 将当前列表项添加到列表项数组中
            }
            // 根据列表类型选择标签
            const label = ordered ? `ol` : `ul`
            return styledContent(label, listItems.join(``))
        },

        image({ href, title, text }: Tokens.Image): string {
            const subText = styledContent(`figcaption`, transform(opts.legend!, text, title))
            const figureStyles = styles(`figure`)
            const imgStyles = styles(`image`)
            return `<figure ${figureStyles}><img ${imgStyles} src="${href}" title="${title}" alt="${text}"/>${subText}</figure>`
        },

        link({ href, title, text, tokens }: Tokens.Link): string {
            const parsedText = this.parser.parseInline(tokens)
            if (href.startsWith(`https://mp.weixin.qq.com`)) {
                return `<a href="${href}" title="${title || text}" ${styles(`wx_link`)}>${parsedText}</a>`
            }
            if (href === text) {
                return parsedText
            }
            if (opts.citeStatus) {
                const ref = addFootnote(title || text, href)
                return `<span ${styles(`link`)}>${parsedText}<sup>[${ref}]</sup></span>`
            }
            return styledContent(`link`, parsedText, `span`)
        },


        strong({ tokens }: Tokens.Strong): string {
            return styledContent(`strong`, this.parser.parseInline(tokens))
        },

        em({ tokens }: Tokens.Em): string {
            return styledContent(`em`, this.parser.parseInline(tokens), `span`)
        },

        table({ header, rows }: Tokens.Table): string {
            const headerRow = header
                .map(cell => this.tablecell(cell))
                .join(``)
            const body = rows
                .map((row) => {
                    const rowContent = row
                        .map(cell => this.tablecell(cell))
                        .join(``)
                    return styledContent(`tr`, rowContent)
                })
                .join(``)
            return `
                <section style="padding:0 8px; max-width: 100%; overflow: auto">
                    <table class="preview-table">
                        <thead ${styles(`thead`)}>${headerRow}</thead>
                        <tbody>${body}</tbody>
                    </table>
                </section>
            `
        },

        tablecell(token: Tokens.TableCell): string {
            const text = this.parser.parseInline(token.tokens)
            return styledContent(`td`, text)
        },

        hr(_: Tokens.Hr): string {
            return styledContent(`hr`, ``)
        },
    }

    marked.use({ renderer })
    return {
        buildAddition,
        buildFootnotes,
        setOptions,
        reset,
        exportHTML,
        createContainer(content: string) {
            return styledContent(`container`, content, `section`)
        },
    }
}



