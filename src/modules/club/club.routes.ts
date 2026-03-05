import { Router } from 'express';

import { UpdateClubDto } from './club.dto.js';
import { ClubController } from './club.controller.js';
import { authMiddleware, authorizationMiddleware } from '../auth/auth.middleware.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';
import { UserType } from '../user/user.entity.js';

export default class ClubRouter {
    private router = Router();
    private clubController = new ClubController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, (req, res, next) =>
            this.clubController.findAll(req, res, next)
        );

        this.router.get('/:id', authMiddleware, (req, res, next) =>
            this.clubController.findOne(req, res, next)
        );

        this.router.patch(
            '/:id',
            authMiddleware,
            authorizationMiddleware(UserType.CLUB),
            validationMiddleware(UpdateClubDto),
            (req, res, next) => this.clubController.update(req, res, next)
        );

        this.router.delete(
            '/:id',
            authMiddleware,
            authorizationMiddleware(UserType.CLUB),
            (req, res, next) => this.clubController.delete(req, res, next)
        );
    }

    public getRouter() {
        return this.router;
    }
}
