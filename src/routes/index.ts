import { Router } from 'express';
import { markdownRouter } from './markdown/markdown';

const routes = Router();

// 服务健康监测
routes.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// 将markdown 格式的内容转换成html 文章
routes.use('/markdown', markdownRouter);


export { routes }; 