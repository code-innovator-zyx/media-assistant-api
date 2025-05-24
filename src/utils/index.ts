import type { Block, ExtendedProperties, Inline, Theme } from '@/types/index.js'
import type { PropertiesHyphen } from 'csstype'
import * as fs from 'fs'


export function customizeTheme(theme: Theme, options: {
  fontSize?: number
  color?: string
}) {
  const newTheme = JSON.parse(JSON.stringify(theme))
  const { fontSize, color } = options
  if (fontSize) {
    for (let i = 1; i <= 6; i++) {
      const v = newTheme.block[`h${i}`][`font-size`]
      newTheme.block[`h${i}`][`font-size`] = `${fontSize * Number.parseFloat(v)}px`
    }
  }
  if (color) {
    newTheme.base[`--md-primary-color`] = color
  }
  return newTheme as Theme
}

export function customCssWithTemplate(jsonString: Partial<Record<Block | Inline, PropertiesHyphen>>, color: string, theme: Theme) {
  const newTheme = customizeTheme(theme, { color })

  const mergeProperties = <T extends Block | Inline = Block>(target: Record<T, PropertiesHyphen>, source: Partial<Record<Block | Inline | string, PropertiesHyphen>>, keys: T[]) => {
    keys.forEach((key) => {
      if (source[key]) {
        target[key] = Object.assign(target[key] || {}, source[key])
      }
    })
  }

  const blockKeys: Block[] = [
    `container`,
    `h1`,
    `h2`,
    `h3`,
    `h4`,
    `h5`,
    `h6`,
    `code`,
    `code_pre`,
    `p`,
    `hr`,
    `blockquote`,
    `blockquote_note`,
    `blockquote_tip`,
    `blockquote_important`,
    `blockquote_warning`,
    `blockquote_caution`,
    `blockquote_p`,
    `blockquote_p_note`,
    `blockquote_p_tip`,
    `blockquote_p_important`,
    `blockquote_p_warning`,
    `blockquote_p_caution`,
    `blockquote_title`,
    `blockquote_title_note`,
    `blockquote_title_tip`,
    `blockquote_title_important`,
    `blockquote_title_warning`,
    `blockquote_title_caution`,
    `image`,
    `ul`,
    `ol`,
    `.hljs`,
  ]
  const inlineKeys: Inline[] = [`strong`, `codespan`, `link`, `wx_link`, `listitem`]

  mergeProperties(newTheme.block, jsonString, blockKeys)
  mergeProperties(newTheme.inline, jsonString, inlineKeys)
  return newTheme
}

/**
 * 将 CSS 字符串转换为 JSON 对象
 *
 * @param {string} css - CSS 字符串
 * @returns {object} - JSON 格式的 CSS
 */
export function css2json(css: string): Partial<Record<Block | Inline, PropertiesHyphen>> {
  // 去除所有 CSS 注释
  css = css.replace(/\/\*[\s\S]*?\*\//g, ``)

  const json: Partial<Record<Block | Inline, PropertiesHyphen>> = {}

  // 辅助函数：将声明数组转换为对象
  const toObject = (array: any[]) =>
    array.reduce<{ [k: string]: string }>((obj, item) => {
      const [property, value] = item.split(`:`).map((part: string) => part.trim())
      if (property)
        obj[property] = value
      return obj
    }, {})

  while (css.includes(`{`) && css.includes(`}`)) {
    const lbracket = css.indexOf(`{`)
    const rbracket = css.indexOf(`}`)

    // 获取声明块并转换为对象
    const declarations = css.substring(lbracket + 1, rbracket)
      .split(`;`)
      .map(e => e.trim())
      .filter(Boolean)

    // 获取选择器并去除空格
    const selectors = css.substring(0, lbracket)
      .split(`,`)
      .map(selector => selector.trim()) as (Block | Inline)[]

    const declarationObj = toObject(declarations)

    // 将声明对象关联到相应的选择器
    selectors.forEach((selector) => {
      json[selector] = { ...(json[selector] || {}), ...declarationObj }
    })

    // 处理下一个声明块
    css = css.slice(rbracket + 1).trim()
  }

  return json
}

/**
 * 将 CSS 文件转换为 JSON 对象
 *
 * @param {string} filePath - CSS 文件路径
 * @returns {object} - JSON 格式的 CSS
 */
export function css2jsonFromFile(filePath: string, codeTheme: string): Partial<Record<Block | Inline, PropertiesHyphen>> {
  let cssContent = fs.readFileSync(filePath, 'utf-8')
  cssContent += codeTheme
  return css2json(cssContent)
}

/**
 * 将样式对象转换为 CSS 字符串
 * @param {ExtendedProperties} style - 样式对象
 * @returns {string} - CSS 字符串
 */
export function getStyleString(style: ExtendedProperties) {
  return Object.entries(style ?? {}).map(([key, value]) => `${key}: ${value}`).join(`; `)
}
