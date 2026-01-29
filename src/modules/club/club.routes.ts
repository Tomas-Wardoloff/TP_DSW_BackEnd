import { Router } from 'express';

import { UpdateClubDto } from './club.dto.js';
import { ClubController } from './club.controller.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';

export default class ClubRouter{
    private router = Router();
    private clubController = new ClubController();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req, res) => this.clubController.findAll(req, res));
        this.router.get('/:id', (req, res) => this.clubController.findOne(req, res));
        this.router.patch('/:id', validationMiddleware(UpdateClubDto), (req, res) =>
            this.clubController.update(req, res)
        );
        this.router.delete('/:id', (req, res) => this.clubController.delete(req, res));
    }

    public getRouter() {
        return this.router;
    }
}