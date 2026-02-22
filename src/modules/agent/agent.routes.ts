import { Router } from 'express';

import { UpdateAgentDto } from './agent.dto.js';
import { AgentController } from './agent.controller.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';

export default class AgentRouter {
    private router = Router();
    private agentController = new AgentController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', (req, res) =>
            this.agentController.findAll(req, res)
        );

        this.router.get('/:id', (req, res) =>
            this.agentController.findOne(req, res)
        );

        this.router.patch(
            '/:id',
            validationMiddleware(UpdateAgentDto),
            (req, res) => this.agentController.update(req, res)
        );

        this.router.delete('/:id', (req, res) =>
            this.agentController.delete(req, res)
        );

        /*
        // Endpoint dedicado para manejar la relación ManyToMany con clubs.
        // PUT porque reemplaza la colección completa, no agrega un elemento.
        this.router.put(
            '/:id/clubs',
            validationMiddleware(UpdateAgentClubsDto),
            (req, res) => this.agentController.updateClubs(req, res)
        );
        */ 
    }

    public getRouter() {
        return this.router;
    }
}