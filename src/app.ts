// src/app.ts
import express from 'express';
import figlet from "figlet"
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '@/middleware/errorHandler.js';
import { requestLogger } from '@/middleware/requestLogger.js';
import { routes } from '@/routes/index.js';
import { config } from '@/config/index.js';
const app = express();

// Security middleware
app.use(helmet({
    // 允许其他跨域图片的加载
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "*.imgix.net", "https:"],
        },
    },
}));
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
    figlet('Media Assistant', (err, data) => {
        if (err) {
            console.log('Error generating ASCII art');
            console.log(err);
            return;
        }
        console.log(data);
        console.log(`\n🚀 Media Assistant API is running at http://localhost:${config.port}\n`);
    });
});

export default app;
