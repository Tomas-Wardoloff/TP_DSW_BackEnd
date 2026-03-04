import { NextFunction, Request, Response } from 'express';

import { AgentService } from './agent.service.js';
import { UpdateAgentDto } from './agent.dto.js';
import { BadRequestError, NotFoundError } from '../../shared/erros/http.erros.js';

export class AgentController {
    private agentService = new AgentService();

    async findAll(req: Request, res: Response, next: NextFunction) {
        const agents = await this.agentService.findAll().catch(next);
        return res.status(200).json({ message: 'Agents found', data: agents });
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) {
            return next(new BadRequestError('Invalid id'));
        }

        const agent = await this.agentService.findOne(id).catch(next);
        if (!agent) {
            return next(new NotFoundError('Agent not found'));
        }

        return res.status(200).json({ message: 'Agent found', data: agent });
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) {
            return next(new BadRequestError('Invalid id'));
        }

        const payload = req.body as UpdateAgentDto;
        const updatedAgent = await this.agentService
            .update(id, payload, req.user!.userId)
            .catch(next);
        return res.status(200).json({ message: 'Agent updated', data: updatedAgent });
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) {
            return next(new BadRequestError('Invalid id'));
        }

        await this.agentService.delete(id, req.user!.userId).catch(next);
        return res.status(204).send();
    }

    /*async updateClubs(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid id' });
            }

            const payload = req.body as UpdateAgentClubsDto;
            const updatedAgent = await this.agentService.updateClubs(id, payload.clubIds);
            return res.status(200).json({ message: 'Agent clubs updated', data: updatedAgent });
        } catch (error: any) {
            if (error.message === 'Agent not found') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'One or more club IDs are invalid') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }*/
}
