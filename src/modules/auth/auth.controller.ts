import { NextFunction, Request, Response } from 'express';

import { LoginDto, RefreshTokenDto } from './auth.dto.js';
import { AuthService } from './auth.service.js';
import { BadRequestError } from '../../shared/erros/http.erros.js';

export class AuthController {
    private authService = new AuthService();

    async login(req: Request, res: Response, next: NextFunction) {
        const payload = req.body as LoginDto;
        const tokens = await this.authService.login(payload).catch(next);
        return res.status(200).json({ message: 'Login successful', data: tokens });
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        const tokens = await this.authService
            .refresh((req.body as RefreshTokenDto).refreshToken)
            .catch(next);
        if (tokens) return res.status(200).json({ message: 'Token refreshed', data: tokens });
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        const { refreshToken } = req.body;
        if (!refreshToken) return next(new BadRequestError('Refresh token is required'));

        await this.authService.logout(refreshToken).catch(next);
        res.status(204).send();
    }
}
