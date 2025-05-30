import { JSDOM } from "jsdom";
import * as cheerio from "cheerio";
import * as cssParser from "css";
import { log } from "console";


describe('setStyles function tests', () => {
  let dom: JSDOM;
  let document: Document;
  let window: any;

  beforeEach(() => {
    // 设置测试 HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .hljs {background:#1c1d21;color:#c0c5ce}
            .code__pre { color: blue; font-size: 14px; }
            code { background: #f5f5f5; padding: 2px; }
            span { color: red; }
          </style>
        </head>
        <body>
        <div id="output">
        <pre class="hljs code__pre">
            <code style="pointer-events:none">
              <span>console.log('test');</span>
            </code>
          </pre>
        </div>
        </body>
      </html>
    `;

    dom = new JSDOM(html);
    document = dom.window.document;
    window = dom.window;
    // 添加 getComputedStyle 到全局
    global.getComputedStyle = window.getComputedStyle;
  });

  function setStyles(html: string, element: Element) {
    function extractStylesWithLibraries(selector: string): Record<string, string> {
      // 使用cheerio加载HTML
      const $ = cheerio.load(html);

      // 存储提取的样式
      const styleRules: Record<string, string> = {};

      // 提取所有样式表
      const styleTags = $('style');

      // 解析每个样式表，找到匹配选择器的规则
      styleTags.each((i, el) => {
        const cssText = $(el).text();
        try {
          const parsed = cssParser.parse(cssText);
          if (parsed.stylesheet && parsed.stylesheet.rules) {
            parsed.stylesheet.rules.forEach(rule => {
              if (rule.type === 'rule' && rule.selectors) {
                // 检查选择器是否匹配
                const matchesSelector = rule.selectors.some(ruleSelector => {
                  // 简单实现：检查选择器是否包含目标选择器或匹配目标元素
                  if (ruleSelector === selector) return true;

                  // 处理类选择器
                  if (selector.startsWith('.') && ruleSelector.includes(selector)) return true;

                  // 处理ID选择器
                  if (selector.startsWith('#') && ruleSelector.includes(selector)) return true;

                  // 处理标签选择器
                  const tagName = selector.toLowerCase();
                  if (!selector.startsWith('.') && !selector.startsWith('#') &&
                    (ruleSelector === tagName || ruleSelector.startsWith(tagName + ' ') ||
                      ruleSelector.includes(' ' + tagName + ' ') || ruleSelector.endsWith(' ' + tagName))) {
                    return true;
                  }

                  return false;
                });

                if (matchesSelector && rule.declarations) {
                  rule.declarations.forEach(declaration => {
                    if ('property' in declaration && 'value' in declaration) {
                      if (declaration.property && declaration.value) {
                        styleRules[declaration.property] = declaration.value;
                      }
                    }
                  });
                }
              }
            });
          }
        } catch (e) {
          console.error('CSS解析错误:', e);
        }
      });

      // 提取内联样式
      const element = $(selector);
      if (element.length && element.attr('style')) {
        const inlineStyle = element.attr('style') || '';
        const propertyRegex = /([\w-]+)\s*:\s*([^;]+);?/g;
        let propertyMatch;
        while ((propertyMatch = propertyRegex.exec(inlineStyle)) !== null) {
          const property = propertyMatch[1].trim();
          const value = propertyMatch[2].trim();
          styleRules[property] = value;
        }
      }

      // 返回样式对象
      return styleRules;
    }
    /**
    * 获取一个 DOM 元素的所有样式，
    * @param {DOM 元素} element DOM 元素
    * @param {排除的属性} excludes 如果某些属性对结果有不良影响，可以使用这个参数来排除
    * @returns 行内样式拼接结果
    */
    function getElementStyles(element: Element, excludes = [`width`, `height`, `inlineSize`, `webkitLogicalWidth`, `webkitLogicalHeight`]): string {
      // 创建一个数组存储所有可能的选择器
      const selectors = [element.tagName.toLowerCase()];

      // 添加每个类作为独立的选择器
      if (element.classList.length > 0) {
        Array.from(element.classList).forEach(className => {
          selectors.push(`.${className}`);
        });
      }

      // 添加ID选择器
      if (element.id) {
        selectors.push(`#${element.id}`);
      }

      // 合并所有选择器找到的样式
      const allStyles: Record<string, string> = {};
      selectors.forEach(selector => {
        const styles = extractStylesWithLibraries(selector);
        Object.assign(allStyles, styles);
      });

      return Object.entries(allStyles)
        .filter(([key]) => !excludes.includes(key))
        .map(([key, value]) => {
          const kebabKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
          return `${kebabKey}:${value};`;
        })
        .join(``);
    }


    if (isPre(element) || isCode(element) || isSpan(element)) {
      console.log(element.innerHTML, `is pre code span`);
      element.setAttribute(`style`, getElementStyles(element));
    }

    if (element.children.length) {
      Array.from(element.children).forEach(child => setStyles(html, child));
    }

    // 判断是否是包裹代码块的 pre 元素 
    function isPre(element: Element) {
      return (
        element.tagName === `PRE`
        && Array.from(element.classList).includes(`code__pre`)
      )
    }

    // 判断是否是包裹代码块的 code 元素 
    function isCode(element: Element | null) {
      if (element == null) {
        return false
      }
      return element.tagName === `CODE`
    }

    // 判断是否是包裹代码字符的 span 元素 
    function isSpan(element: Element) {
      return (
        element.tagName === `SPAN`
        && (isCode(element.parentElement)
          || isCode((element.parentElement!).parentElement))
      )
    }
  }

  test('should correctly identify and style pre element', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .hljs {background:#1c1d21;color:#c0c5ce}
            .code__pre { color: blue; font-size: 14px; }
            code { background: #f5f5f5; padding: 2px; }
            span { color: red; }
          </style>
        </head>
        <body>
        <div id="output">
                  <pre class="hljs code__pre">
            <code style="pointer-events:none">
              <span>console.log('test');</span>
            </code>
          </pre>
        </div>
        </body>
      </html>
    `;
    console.log(dom.serialize());

    const preElement = document.querySelector(`#output`)!;
    console.log(preElement.innerHTML);

    setStyles(html, preElement);
    console.log(preElement.innerHTML);

    expect(preElement.hasAttribute('style')).toBe(true);
    expect((preElement as HTMLElement).style.color).toBe('blue');
    expect((preElement as HTMLElement).style.fontSize).toBe('14px');
  });
});