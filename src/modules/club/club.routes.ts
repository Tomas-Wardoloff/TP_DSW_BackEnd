import { Router } from 'express';

import { UpdateClubDto } from './club.dto.js';
import { ClubController } from './club.controller.js';
import { authMiddleware, authorizationMiddleware } from '../auth/auth.middleware.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';
import { UserType } from '../user/user.entity.js';

export default class ClubRouter{
    private router = Router();
    private clubController = new ClubController();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware,
            (req, res) => this.clubController.findAll(req, res));

        this.router.get('/:id', authMiddleware, 
            (req, res) => this.clubController.findOne(req, res));
        
        this.router.patch('/:id', authMiddleware, 
            authorizationMiddleware(UserType.CLUB),
            validationMiddleware(UpdateClubDto), 
            (req, res) => this.clubController.update(req, res)
        );
        
        this.router.delete('/:id', authMiddleware, 
            authorizationMiddleware(UserType.CLUB),
            (req, res) => this.clubController.delete(req, res));
    }

    public getRouter() {
        return this.router;
    }
}