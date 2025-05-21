import { Router } from "express";
import { markdownToHtml } from "@/handler/markdown.js";
const markdownRouter = Router();

// 在这里定义您的路由
markdownRouter.post("/html", async (req, res) => {
    const response = await markdownToHtml(req.body)
    res.json(response);
});

markdownRouter.get("/download", (_, res) => {
    try {
        const aiProductSummary = `
> 今天为你带来全球最新的AI产品汇总，每一款都能手把手指导你如何实现收入增长！从网站建设到内容营销，从音乐创作到社交管理，这些AI工具将彻底改变你的副业玩法。快来看看这些创新科技如何助你轻松开启财富之路！  (排行来源于官方真实数据)

## 🏆 1. [Wegic](https://www.producthunt.com/posts/wegic-2?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+test+%28ID%3A+153823%29)

![Wegic](https://ph-files.imgix.net/852ad5a2-d3a0-496c-871c-a567e013ed30.png?auto=format&fit=crop&frame=1&h=512&w=1024)

### 🔑 关键词
\`Wegic, AI网站团队, 人工智能设计师, 网站开发, 网站管理, 聊天构建网站, 自动更新网站, AI技术, 网站建设, 智能网站助手\`

### 🏷 标语
你的第一个人工智能网站团队

### 📖 简介
Wegic是你的AI网站团队——你的AI设计师、开发者和管理者。只需与它聊天，你的网站就能被创建、运行，并轻松更新。

### 🚀 赋能副业增长
1. **网站建设服务**：利用Wegic的AI技术，提供定制化的网站建设服务。你可以为小企业或个人提供快速、经济的网站搭建，吸引那些希望在线上增加曝光的客户。

2. **网站维护及更新**：成为Wegic的代理，提供网站维护和更新服务，帮助客户保持网站内容的新鲜度和安全性，收取定期服务费。

3. **在线课程或咨询**：利用Wegic创建一个在线课程或咨询服务，教授他人如何使用AI工具进行网站建设和管理，赚取课程费用或咨询费用。

### 📊 产品数据
**票数:** 🔺599  
**是否精选:** ✅ 是  
**发布时间:** 2025年01月07日 PM04:01 (北京时间)  

### 🌐 产品链接
**官网地址:**  
\`\`\`
https://www.producthunt.com/r/G6KIXQ3NRL6UMC?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+test+%28ID%3A+153823%29
\`\`\`
> 在这个快速发展的AI时代，抓住机遇、善用这些工具，将为你的副业带来无限可能。每一款产品都蕴含着让你收入倍增的潜力，你准备好行动了吗？让我们一起探索这些科技背后的财富密码，开启你的副业新篇章！
`;
        res.setHeader(`Content-Type`, `text/html`)
        markdownToHtml({ data: aiProductSummary, isMacCodeBlock: true }).then(content => {
            res.send(content.html)
        }, (error) => {
            res.status(500).json({ error: (error as Error).message })
        })
    }
    catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
})

export { markdownRouter };
