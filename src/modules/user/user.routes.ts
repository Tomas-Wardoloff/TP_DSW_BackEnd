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
        this.router.post('/', validationMiddleware(CreateUserDto), (req, res) =>
            this.userController.create(req, res)
        );

        this.router.get('/', authMiddleware, 
            (req, res) => this.userController.findAll(req, res)
        );

        this.router.get('/:id', authMiddleware, 
            (req, res) => this.userController.findOne(req, res)
        );

        this.router.patch('/:id', 
            authMiddleware, 
            validationMiddleware(UpdateUserDto), 
            (req, res) => this.userController.update(req, res)
        );

        this.router.delete('/:id', authMiddleware, 
            (req, res) => this.userController.delete(req, res)
        );
    }

    public getRouter() {
        return this.router;
    }
}
