import { Router } from 'express';

import { UpdateAgentDto } from './agent.dto.js';
import { AgentController } from './agent.controller.js';
import { authMiddleware, authorizationMiddleware } from '../auth/auth.middleware.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';
import { UserType } from '../user/user.entity.js';

export default class AgentRouter {
    private router = Router();
    private agentController = new AgentController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware, (req, res, next) =>
            this.agentController.findAll(req, res, next)
        );

        this.router.get('/:id', authMiddleware, (req, res, next) =>
            this.agentController.findOne(req, res, next)
        );

        this.router.patch(
            '/:id',
            authMiddleware,
            authorizationMiddleware(UserType.AGENT),
            validationMiddleware(UpdateAgentDto),
            (req, res, next) => this.agentController.update(req, res, next)
        );

        this.router.delete(
            '/:id',
            authMiddleware,
            authorizationMiddleware(UserType.AGENT),
            (req, res, next) => this.agentController.delete(req, res, next)
        );

        /*this.router.put(
            '/:id/clubs',
            authMiddleware,
            authorizationMiddleware(UserType.AGENT),
            validationMiddleware(UpdateAgentClubsDto),
            (req, res) => this.agentController.updateClubs(req, res)
        );*/
    }

    public getRouter() {
        return this.router;
    }
}
