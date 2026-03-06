import { Request, Response, NextFunction } from 'express';

import { AppError } from '../erros/http.erros.js';

export function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }

    if (error.name === 'NotFoundError') {
        return res.status(404).json({ message: 'Resource not found' });
    }

    if (error.name === 'UniqueConstraintViolationException') {
        return res.status(409).json({ message: 'Resource already exists' });
    }

    // Cualquier otro error es inesperado. Lo logueamos en el servidor
    console.error(`[${new Date().toISOString()}] Unhandled error:`, error);

    return res.status(500).json({
        message: 'Internal server error',
    });
}
