import mermaid from 'mermaid';

export function mermaidRenderer(text: string, index: number): string {
    const svg = mermaid.render(`mermaid-diagram-${index}`, text);
    return `<pre class="mermaid">${svg}</pre>`;
}
