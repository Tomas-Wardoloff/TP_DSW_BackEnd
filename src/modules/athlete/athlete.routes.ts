import { Router } from 'express';

import { UpdateAthleteDto } from './athlete.dto.js';
import { AthleteController } from './athlete.controller.js';
import { authMiddleware, authorizationMiddleware } from '../auth/auth.middleware.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';
import { UserType } from '../user/user.entity.js';

export default class AthleteRouter {
    private router = Router();
    private athleteController = new AthleteController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, (req, res, next) =>
            this.athleteController.findAll(req, res, next)
        );

        this.router.get('/:id', authMiddleware, (req, res, next) =>
            this.athleteController.findOne(req, res, next)
        );

        this.router.patch(
            '/:id',
            authMiddleware,
            authorizationMiddleware(UserType.ATHLETE),
            validationMiddleware(UpdateAthleteDto),
            (req, res, next) => this.athleteController.update(req, res, next)
        );

        this.router.delete(
            '/:id',
            authMiddleware,
            authorizationMiddleware(UserType.ATHLETE),
            (req, res, next) => this.athleteController.delete(req, res, next)
        );
    }

    public getRouter() {
        return this.router;
    }
}
