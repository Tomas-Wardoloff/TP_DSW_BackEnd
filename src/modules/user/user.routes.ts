import { Router } from 'express';

import { CreateUserDto, UpdateUserDto } from './user.dto.js';
import { UserController } from './user.controller.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';

export default class UserRouter {
    private router = Router();
    private userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req, res) => this.userController.findAll(req, res));
        this.router.get('/:id', (req, res) => this.userController.findOne(req, res));
        this.router.post('/', validationMiddleware(CreateUserDto), (req, res) =>
            this.userController.create(req, res)
        );
        this.router.patch('/:id', validationMiddleware(UpdateUserDto), (req, res) =>
            this.userController.update(req, res)
        );
        this.router.delete('/:id', (req, res) => this.userController.delete(req, res));
    }

    public getRouter() {
        return this.router;
    }
}
