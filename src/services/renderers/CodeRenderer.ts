import hljs from 'highlight.js';
import { ThemeStyles } from '@/types/index.js';
import { getStyles } from '@/utils/helpers.js';

const macCodeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="45px" height="13px" viewBox="0 0 450 130">
  <ellipse cx="50" cy="65" rx="50" ry="52" stroke="rgb(220,60,54)" stroke-width="2" fill="rgb(237,108,96)" />
  <ellipse cx="225" cy="65" rx="50" ry="52" stroke="rgb(218,151,33)" stroke-width="2" fill="rgb(247,193,81)" />
  <ellipse cx="400" cy="65" rx="50" ry="52" stroke="rgb(27,161,37)" stroke-width="2" fill="rgb(100,200,86)" />
</svg>
`.trim();

export function codeRenderer(text: string, lang: string, styleMapping: ThemeStyles, isMacStyle: boolean): string {
    const langText = lang.split(' ')[0];
    const language = hljs.getLanguage(langText) ? langText : 'plaintext';
    let highlighted = hljs.highlight(text, { language }).value;

    highlighted = formatCode(highlighted);

    // Add mac-style GUI and code wrapper
    return wrapCodeBlock(highlighted, lang, styleMapping, isMacStyle);
}

function formatCode(code: string): string {
    return code
        .replace(/\t/g, '    ')
        .replace(/\r\n/g, '<br/>')
        .replace(/\n/g, '<br/>')
        .replace(/(>[^<]+)|(^[^<]+)/g, str => str.replace(/\s/g, '&nbsp;'));
}

function wrapCodeBlock(code: string, lang: string, styleMapping: ThemeStyles, isMacStyle: boolean): string {
    let macStyleAddition = ""
    if (isMacStyle) {
        macStyleAddition = "display: flex;"
    }
    const span = `<span class="mac-sign" style="padding: 10px 14px 0;${macStyleAddition}" hidden>${macCodeSvg}</span>`;
    const addition = `;display: -webkit-box;padding: 0.5em 1em 1em;overflow-x: auto;text-indent: 0;white-space: nowrap;`
    const codeElement = `<code class="language-${lang}" ${getStyles(styleMapping, 'code', addition)}>${code}</code>`

    return `<pre class="hljs code__pre" ${getStyles(styleMapping, `.hljs`, ";padding: 0 !important;")}>${span}${codeElement}</pre>`;
} 