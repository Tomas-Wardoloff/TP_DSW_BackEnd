import { Router } from 'express';

import { UserController } from './user.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { CreateUserDto, UpdateUserDto } from './user.dto.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';

export default class UserRouter {
    private router = Router();
    private userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', validationMiddleware(CreateUserDto), (req, res, next) =>
            this.userController.create(req, res, next)
        );

        this.router.get('/', authMiddleware, (req, res, next) => this.userController.findAll(req, res, next));

        this.router.get('/:id', authMiddleware, (req, res, next) =>
            this.userController.findOne(req, res, next)
        );

        this.router.patch('/:id', authMiddleware, validationMiddleware(UpdateUserDto), (req, res, next) =>
            this.userController.update(req, res, next)
        );

        this.router.delete('/:id', authMiddleware, (req, res, next) =>
            this.userController.delete(req, res, next)
        );
    }

    public getRouter() {
        return this.router;
    }
}
