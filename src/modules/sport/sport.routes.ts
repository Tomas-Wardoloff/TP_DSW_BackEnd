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
            (req, res) => this.sportController.findAllSports(req, res)
        );

        this.router.get(
            '/sports/:id',
            /*authMiddleware,*/
            (req, res) => this.sportController.findOneSport(req, res)
        );

        // GET /catalog/positions
        // GET /catalog/positions?sportId=1
        this.router.get(
            '/positions',
            /*authMiddleware,*/
            (req, res) => this.sportController.findAllPositions(req, res)
        );

        this.router.get(
            '/positions/:id',
            /*authMiddleware,*/
            (req, res) => this.sportController.findOnePosition(req, res)
        );
    }

    public getRouter() {
        return this.router;
    }
}
