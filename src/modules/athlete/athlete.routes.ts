import { Router } from 'express';

import { UpdateAthleteDto } from './athlete.dto.js';
import { AthleteController } from './athlete.controller.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';

export default class AthleteRouter {
    private router = Router();
    private athleteController = new AthleteController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req, res) => this.athleteController.findAll(req, res));
        this.router.get('/:id', (req, res) => this.athleteController.findOne(req, res));
        this.router.patch('/:id', validationMiddleware(UpdateAthleteDto), (req, res) =>
            this.athleteController.update(req, res)
        );
        this.router.delete('/:id', (req, res) => this.athleteController.delete(req, res));
    }

    public getRouter() {
        return this.router;
    }
}
