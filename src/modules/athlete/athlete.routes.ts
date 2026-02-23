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
        this.router.get('/', authMiddleware, 
            (req, res) => this.athleteController.findAll(req, res));

        this.router.get('/:id', authMiddleware, 
            (req, res) => this.athleteController.findOne(req, res));
        
        this.router.patch('/:id', authMiddleware, 
            authorizationMiddleware(UserType.ATHLETE),
            validationMiddleware(UpdateAthleteDto), 
            (req, res) => this.athleteController.update(req, res)
        );
        
        this.router.delete('/:id', authMiddleware, 
            authorizationMiddleware(UserType.ATHLETE), 
            (req, res) => this.athleteController.delete(req, res));
    }

    public getRouter() {
        return this.router;
    }
}
