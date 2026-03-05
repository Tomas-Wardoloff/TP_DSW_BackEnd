import { Router } from 'express';
import { SportController } from './sport.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';

export default class SportRouter {
    private router = Router();
    private sportController = new SportController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            '/sports',
            /*authMiddleware,*/
            (req, res, next) => this.sportController.findAllSports(req, res, next)
        );

        this.router.get(
            '/sports/:id',
            /*authMiddleware,*/
            (req, res, next) => this.sportController.findOneSport(req, res, next)
        );

        // GET /catalog/positions
        // GET /catalog/positions?sportId=1
        this.router.get(
            '/positions',
            /*authMiddleware,*/
            (req, res, next) => this.sportController.findAllPositions(req, res, next)
        );

        this.router.get(
            '/positions/:id',
            /*authMiddleware,*/
            (req, res, next) => this.sportController.findOnePosition(req, res, next)
        );
    }

    public getRouter() {
        return this.router;
    }
}
