export interface MarkdownToHtmlRequest {
    data: string
    isMacCodeBlock: boolean
    // 添加可选的配置参数，使用字符串类型而不是枚举类型
    theme?: string
    fontFamily?: string  // 直接使用字符串，如 "无衬线"、"衬线"、"等宽"
    fontSize?: string    // 直接使用字符串，如 "12px"、"14px"、"16px"
    isUseIndent?: boolean
    primaryColor?: string
    citeStatus?: boolean
    legend?: string
    codeTheme?: string
}

export interface MarkdownToHtmlResponse {
    html: string
    code: number
    message: string
}
