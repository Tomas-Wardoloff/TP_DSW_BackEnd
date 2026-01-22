import { Request, Response } from 'express';

import { User } from '../user/user.entity.js';
import { Athlete } from './athlete.entity.js';
import { AthleteService } from './athlete.service.js';

export class AthleteController {
    private athleteService = new AthleteService();

    async findAll(req: Request, res: Response) {
        try {
            const athletes = await this.athleteService.findAll();
            return res.status(200).json({ message: 'Found athletes', data: athletes });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            const athlete = await this.athleteService.findOne(id);
            return res.status(200).json({ message: 'Found athlete', data: athlete });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const payload = req.body;
            const id = Number.parseInt(req.params.id);
            await this.athleteService.update(id, payload);
            return res.status(200).json({ message: 'Athlete updated' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            await this.athleteService.delete(id);
            return res.status(200).json({ message: 'Athlete removed' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
