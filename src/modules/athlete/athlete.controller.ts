import { Request, Response } from 'express';

import { User } from '../user/user.entity.js';
import { Athlete } from './athlete.entity.js';
import { AthleteService } from './athlete.service.js';
import { UpdateAthleteDto } from './athlete.dto.js';

export class AthleteController {
    private athleteService = new AthleteService();

    async findAll(req: Request, res: Response) {
        try {
            const athletes = await this.athleteService.findAll();
            return res.status(200).json({ message: 'Athletes found', data: athletes });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid athlete ID' });

            const athlete = await this.athleteService.findOne(id);

            if (!athlete) return res.status(404).json({ message: 'Athlete not found' });

            return res.status(200).json({ message: 'Athlete found', data: athlete });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid athlete ID' });

            const payload = req.body as UpdateAthleteDto;
            const updatedAthlete = await this.athleteService.update(id, payload, req.user!.userId);
            return res.status(200).json({ message: 'Athlete updated', data: updatedAthlete });
        } catch (error: any) {
            if (error.message === 'Athlete not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            if (
                error.message === 'One or more sport IDs are invalid' ||
                error.message === 'One or more position IDs are invalid'
            )
                return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid athlete ID' });

            await this.athleteService.delete(id, req.user!.userId);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Athlete not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
}
