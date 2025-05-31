import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '8080', 10),

    // Markdown conversion settings
    markdown: {
        defaultTheme: 'github',
        codeHighlightTheme: 'github-dark',
        enableMermaid: true,
        enableKatex: true,
        enableMacStyle: true,
    },

    // Cache settings
    cache: {
        enabled: process.env.CACHE_ENABLED === 'true',
        ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour
    },

    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    },
} as const; 