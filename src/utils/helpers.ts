import type { ThemeStyles } from '@/types/index.js';
import { PropertiesHyphen } from 'csstype';

export function getStyleString(styles: PropertiesHyphen): string {
    return Object.entries(styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join(';');
}

export function getStyles(styleMapping: ThemeStyles, tokenName: string, addition: string = ''): string {
    const dict = styleMapping[tokenName as keyof ThemeStyles];
    if (!dict) {
        return '';
    }
    const styles = getStyleString(dict);
    return `style="${styles}${addition}"`;
}

export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
}

export function buildFootnoteArray(footnotes: [number, string, string][]): string {
    return footnotes
        .map(([index, title, link]) =>
            link === title
                ? `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code>: <i style="word-break: break-all">${title}</i><br/>`
                : `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code> ${title}: <i style="word-break: break-all">${link}</i><br/>`
        )
        .join('\n');
} 