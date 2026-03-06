import { Router } from 'express';

import { AuthController } from './auth.controller.js';
import { LoginDto, RefreshTokenDto } from './auth.dto.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';
import { authMiddleware } from './auth.middleware.js';

export default class AuthRouter {
    private router = Router();
    private authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', validationMiddleware(LoginDto), (req, res, next) =>
            this.authController.login(req, res, next)
        );

        this.router.post('/refresh', validationMiddleware(RefreshTokenDto), (req, res, next) =>
            this.authController.refresh(req, res, next)
        );

        this.router.post('/logout', authMiddleware, (req, res, next) =>
            this.authController.logout(req, res, next)
        );
    }

    public getRouter() {
        return this.router;
    }
}
