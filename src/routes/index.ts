import { Router } from 'express';
import { markdownRouter } from './markdown/markdown';

const routes = Router();

routes.use('/markdown', markdownRouter);

// Health check endpoint
routes.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export { routes }; 