import { Request, Response } from 'express';

import { AuthService } from './auth.service.js';

export class AuthController {
    private authService = new AuthService();

    async login(req: Request, res: Response) {
        try {
            const tokens = await this.authService.login(req.body);
            return res.status(200).json({ message: 'Login successful', data: tokens });
        } catch (error: any) {
            if (error.message === 'Invalid credentials')
                return res.status(401).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refresh(refreshToken);
            return res.status(200).json({ message: 'Token refreshed', data: tokens });
        } catch (error: any) {
            if (error.message === 'Invalid refresh token')
                return res.status(401).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
}
