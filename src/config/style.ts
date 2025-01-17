import type { IConfigOption } from '@/types'
import { FontFamilyLabel, FontSizeLabel, ColorLabel, LegendLabel } from '@/types/index.js'


const fontFamilyOptions: IConfigOption[] = [
  {
    label: FontFamilyLabel.SansSerif,
    value: `-apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif`,
    desc: `字体123Abc`,
  },
  {
    label: FontFamilyLabel.Serif,
    value: `Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif`,
    desc: `字体123Abc`,
  },
  {
    label: FontFamilyLabel.Monospace,
    value: `Menlo, Monaco, 'Courier New', monospace`,
    desc: `字体123Abc`,
  },
]




// 获取字体
export function fontFamily(label: FontFamilyLabel): IConfigOption {
  const option = fontFamilyOptions.find((item) => item.label === label)
  return option ? option : fontFamilyOptions[0]
}


const fontSizeOptions: IConfigOption[] = [
  {
    label: FontSizeLabel.XXSmall,
    value: `12px`,
    desc: `更小`,
  },
  {
    label: FontSizeLabel.XSmall,
    value: `13px`,
    desc: `稍小`,
  },
  {
    label: FontSizeLabel.Small,
    value: `14px`,
    desc: `推荐`,
  },
  {
    label: FontSizeLabel.Medium,
    value: `15px`,
    desc: `稍大`,
  },
  {
    label: FontSizeLabel.Large,
    value: `16px`,
    desc: `更大`,
  },
]

// 字体颜色
export function fontSize(label: FontSizeLabel): IConfigOption {
  const option = fontSizeOptions.find((item) => item.label === label)
  return option ? option : fontSizeOptions[2]
}


const colorOptions: IConfigOption[] = [
  {
    label: ColorLabel.Blue,
    value: `#0F4C81`,
    desc: `稳重冷静`,
  },
  {
    label: ColorLabel.Green,
    value: `#009874`,
    desc: `自然平衡`,
  },
  {
    label: ColorLabel.Orange,
    value: `#FA5151`,
    desc: `热情活力`,
  },
  {
    label: ColorLabel.Yellow,
    value: `#FECE00`,
    desc: `明亮温暖`,
  },
  {
    label: ColorLabel.Purple,
    value: `#92617E`,
    desc: `优雅神秘`,
  },
  {
    label: ColorLabel.Blue2,
    value: `#55C9EA`,
    desc: `清爽自由`,
  },
  {
    label: ColorLabel.Pink,
    value: `#B76E79`,
    desc: `奢华现代`,
  },
  {
    label: ColorLabel.Green2,
    value: `#556B2F`,
    desc: `沉稳自然`,
  },
  {
    label: ColorLabel.Black,
    value: `#333333`,
    desc: `内敛极简`,
  },
  {
    label: ColorLabel.Gray,
    value: `#A9A9A9`,
    desc: `柔和低调`,
  },
  {
    label: ColorLabel.Pink2,
    value: `#FFB7C5`,
    desc: `浪漫甜美`,
  },
]
// 主题颜色
export function color(label: ColorLabel): IConfigOption {
  const option = colorOptions.find((item) => item.label === label)
  return option ? option : colorOptions[1]
}


const codeBlockUrlPrefix = `https://cdn.bootcdn.net/ajax/libs/highlight.js/11.10.0/styles/`
const codeBlockThemeList = [
  `1c-light.min.css`,
  `a11y-dark.min.css`,
  `a11y-light.min.css`,
  `agate.min.css`,
  `an-old-hope.min.css`,
  `androidstudio.min.css`,
  `arduino-light.min.css`,
  `arta.min.css`,
  `ascetic.min.css`,
  `atom-one-dark-reasonable.min.css`,
  `atom-one-dark.min.css`,
  `atom-one-light.min.css`,
  `brown-paper.min.css`,
  `codepen-embed.min.css`,
  `color-brewer.min.css`,
  `dark.min.css`,
  `default.min.css`,
  `devibeans.min.css`,
  `docco.min.css`,
  `far.min.css`,
  `felipec.min.css`,
  `foundation.min.css`,
  `github-dark-dimmed.min.css`,
  `github-dark.min.css`,
  `github.min.css`,
  `gml.min.css`,
  `googlecode.min.css`,
  `gradient-dark.min.css`,
  `gradient-light.min.css`,
  `grayscale.min.css`,
  `hybrid.min.css`,
  `idea.min.css`,
  `intellij-light.min.css`,
  `ir-black.min.css`,
  `isbl-editor-dark.min.css`,
  `isbl-editor-light.min.css`,
  `kimbie-dark.min.css`,
  `kimbie-light.min.css`,
  `lightfair.min.css`,
  `lioshi.min.css`,
  `magula.min.css`,
  `mono-blue.min.css`,
  `monokai-sublime.min.css`,
  `monokai.min.css`,
  `night-owl.min.css`,
  `nnfx-dark.min.css`,
  `nnfx-light.min.css`,
  `nord.min.css`,
  `obsidian.min.css`,
  `panda-syntax-dark.min.css`,
  `panda-syntax-light.min.css`,
  `paraiso-dark.min.css`,
  `paraiso-light.min.css`,
  `pojoaque.min.css`,
  `purebasic.min.css`,
  `qtcreator-dark.min.css`,
  `qtcreator-light.min.css`,
  `rainbow.min.css`,
  `routeros.min.css`,
  `school-book.min.css`,
  `shades-of-purple.min.css`,
  `srcery.min.css`,
  `stackoverflow-dark.min.css`,
  `stackoverflow-light.min.css`,
  `sunburst.min.css`,
  `tokyo-night-dark.min.css`,
  `tokyo-night-light.min.css`,
  `tomorrow-night-blue.min.css`,
  `tomorrow-night-bright.min.css`,
  `vs.min.css`,
  `vs2015.min.css`,
  `xcode.min.css`,
  `xt256.min.css`,
].sort()


// 代码
export const codeBlockThemeOptions: IConfigOption[] = codeBlockThemeList.map((codeBlockTheme) => {
  const label = codeBlockTheme.replace(`.min.css`, ``)
  const value = `${codeBlockUrlPrefix}${codeBlockTheme}`
  return {
    label,
    value,
    desc: ``,
  }
})


// 图注格式
const legendOptions = [
  {
    label: LegendLabel.FirstTitle,
    value: `title-alt`,
    desc: ``,
  },
  {
    label: LegendLabel.FirstAlt,
    value: `alt-title`,
    desc: ``,
  },
  {
    label: LegendLabel.OnlyTitle,
    value: `title`,
    desc: ``,
  },
  {
    label: LegendLabel.OnlyAlt,
    value: `alt`,
    desc: ``,
  },
  {
    label: LegendLabel.None,
    value: `none`,
    desc: ``,
  },
]

export function getLegend(label: LegendLabel): IConfigOption {
  const option = legendOptions.find((item) => item.label === label)
  return option ? option : legendOptions[2]
}