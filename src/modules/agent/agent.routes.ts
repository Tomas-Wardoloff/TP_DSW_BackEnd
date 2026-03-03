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
        this.router.get('/', authMiddleware, (req, res) => this.agentController.findAll(req, res));

        this.router.get('/:id', authMiddleware, (req, res) =>
            this.agentController.findOne(req, res)
        );

        this.router.patch(
            '/:id',
            authMiddleware,
            authorizationMiddleware(UserType.AGENT),
            validationMiddleware(UpdateAgentDto),
            (req, res) => this.agentController.update(req, res)
        );

        this.router.delete(
            '/:id',
            authMiddleware,
            authorizationMiddleware(UserType.AGENT),
            (req, res) => this.agentController.delete(req, res)
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
