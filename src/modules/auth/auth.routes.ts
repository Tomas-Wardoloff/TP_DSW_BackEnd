import { Router } from 'express';

import { AuthController } from './auth.controller.js';
import { LoginDto, RefreshTokenDto } from './auth.dto.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';

export default class AuthRouter {
    private router = Router();
    private authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', validationMiddleware(LoginDto), (req, res) =>
            this.authController.login(req, res)
        );

        this.router.post('/refresh', validationMiddleware(RefreshTokenDto), (req, res) =>
            this.authController.refresh(req, res)
        );
    }

    public getRouter() {
        return this.router;
    }
}
