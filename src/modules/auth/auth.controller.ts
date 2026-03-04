import { NextFunction, Request, Response } from 'express';

import { AuthService } from './auth.service.js';

export class AuthController {
    private authService = new AuthService();

    async login(req: Request, res: Response, next: NextFunction) {
        const tokens = await this.authService.login(req.body).catch(next);
        return res.status(200).json({ message: 'Login successful', data: tokens });
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        const { refreshToken } = req.body;
        const tokens = await this.authService.refresh(refreshToken).catch(next);
        return res.status(200).json({ message: 'Token refreshed', data: tokens });
    }
}
