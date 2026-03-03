import { Request, Response } from 'express';

import { AgentService } from './agent.service.js';
import { UpdateAgentDto } from './agent.dto.js';

export class AgentController {
    private agentService = new AgentService();

    async findAll(req: Request, res: Response) {
        try {
            const agents = await this.agentService.findAll();
            return res.status(200).json({ message: 'Agents found', data: agents });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid id' });
            }

            const agent = await this.agentService.findOne(id);
            if (!agent) {
                return res.status(404).json({ message: 'Agent not found' });
            }

            return res.status(200).json({ message: 'Agent found', data: agent });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid id' });
            }

            const payload = req.body as UpdateAgentDto;
            const updatedAgent = await this.agentService.update(id, payload, req.user!.userId);
            return res.status(200).json({ message: 'Agent updated', data: updatedAgent });
        } catch (error: any) {
            if (error.message === 'Agent not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid id' });
            }

            await this.agentService.delete(id, req.user!.userId);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Agent not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
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
