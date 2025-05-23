import type { PropertiesHyphen } from 'csstype'

import type { Token } from 'marked'

type GFMBlock = `blockquote_note` | `blockquote_tip` | `blockquote_important` | `blockquote_warning` | `blockquote_caution` | `blockquote_title` | `blockquote_title_note` | `blockquote_title_tip` | `blockquote_title_important` | `blockquote_title_warning` | `blockquote_title_caution` | `blockquote_p` | `blockquote_p_note` | `blockquote_p_tip` | `blockquote_p_important` | `blockquote_p_warning` | `blockquote_p_caution`
export type Block = `container` | `h1` | `h2` | `h3` | `h4` | `h5` | `h6` | `p` | `blockquote` | `blockquote_p` | `code_pre` | `code` | `image` | `ol` | `ul` | `footnotes` | `figure` | `hr` | GFMBlock
export type Inline = `listitem` | `codespan` | `link` | `wx_link` | `strong` | `table` | `thead` | `td` | `footnote` | `figcaption` | `em`


interface CustomCSSProperties {
  [`--md-primary-color`]?: string
  [key: `--${string}`]: string | undefined
}

export type ExtendedProperties = PropertiesHyphen & CustomCSSProperties
export interface Theme {
  base: ExtendedProperties
  block: Record<Block, ExtendedProperties>
  inline: Record<Inline, ExtendedProperties>
}

export interface IOpts {
  theme: Theme  // 主题
  fonts: string  // 字体
  size: string  // 字体大小
  isUseIndent: boolean  //段落首行缩进
  legend?: string // 图注格式
  citeStatus?: boolean  // 是否启用脚注
  isMacStyle?: boolean  // 是否启用 Mac 风格代码块
  primaryColor: string  // 主色调
  codeTheme?: string;
}

export type ThemeStyles = Record<Block | Inline, ExtendedProperties>

// 字体枚举类型
export enum FontFamilyLabel {
  SansSerif = "无衬线",
  Serif = "衬线",
  Monospace = "等宽",
}

export enum FontSizeLabel {
  XXSmall = "12px",
  XSmall = "13px",
  Small = "14px",
  Medium = "15px",
  Large = "16px",
}

export enum ColorLabel {
  Blue = "经典蓝",
  Green = "翡翠绿",
  Orange = "活力橘",
  Yellow = "柠檬黄",
  Purple = "薰衣紫",
  Blue2 = "天空蓝",
  Pink = "玫瑰金",
  Green2 = "橄榄绿",
  Black = "石墨黑",
  Gray = "雾烟灰",
  Pink2 = "樱花粉",
}

export enum LegendLabel {
  FirstTitle = "title 优先",
  FirstAlt = "alt 优先",
  OnlyTitle = "只显示 title",
  OnlyAlt = "只显示 alt",
  None = "不显示"
}

export enum ThemeLabel {
  Default = "经典",
  Grace = "优雅",
}

export interface IConfigOption<VT = string> {
  label: FontFamilyLabel | FontSizeLabel | ColorLabel | LegendLabel | ThemeLabel | string
  value: VT
  desc: string
}

/**
 * Options for the `markedAlert` extension.
 */
export interface AlertOptions {
  className?: string
  variants?: AlertVariantItem[]
  styles?: ThemeStyles
}

/**
 * Configuration for an alert type.
 */
export interface AlertVariantItem {
  type: string
  icon: string
  title?: string
  titleClassName?: string
}

/**
 * Represents an alert token.
 */
export interface Alert {
  type: `alert`
  meta: {
    className: string
    variant: string
    icon: string
    title: string
    titleClassName: string
  }
  raw: string
  text: string
  tokens: Token[]
}
