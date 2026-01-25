import { Request, Response } from 'express';

import { AgentService } from './agent.service.js';

// Manejo la creacion de un agente desde lo usuarios
//async function add(req: Request, res: Response) {
//    try {
//        const { userId } = req.body;
//        const { clubId } = req.body;
//        const relatedUser = await em.findOneOrFail(User, { id: userId });
//        const relatedClub = await em.findOneOrFail(Club, clubId);
//        const existingAgent = await em.findOne(Agent, { user: relatedUser });
//        if (existingAgent) {
//            res.status(409).json({ message: 'Agent already exists' });
//        } else {
//            req.body.club = relatedClub;
//            req.body.user = relatedUser;
//            const newAgent = em.create(Agent, req.body);
//            await em.flush();
//            res.status(201).json({ message: 'Agent created', data: newAgent });
//        }
//    } catch (error: any) {
//        res.status(500).json({ message: error.message });
//    }
//}

export class AgentController {
    private agentService = new AgentService();

    async findAll(req: Request, res: Response) {
        try {
            const agents = await this.agentService.findAll();
            return res.status(200).json({ message: 'Found agents', data: agents });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            const agent = await this.agentService.findOne(id);
            return res.status(200).json({ message: 'Found agent', data: agent });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const payload = req.body;
            const id = Number.parseInt(req.params.id);
            await this.agentService.update(id, payload);
            return res.status(200).json({ message: 'Agent updated' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            await this.agentService.delete(id);
            return res.status(200).json({ message: 'Agent removed' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}