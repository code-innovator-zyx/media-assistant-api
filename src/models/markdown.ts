export interface MarkdownToHtmlRequest {
    data: string
    isMacCodeBlock: boolean
}

export interface MarkdownToHtmlResponse {
    html: string
    code: number
    message: string
}
