import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { config } from '@/config/index.js';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler: ErrorRequestHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            ...(config.nodeEnv === 'development' && { stack: err.stack }),
        });
        return;
    }

    // Log unexpected errors
    console.error('Unexpected error:', err);

    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
}; 