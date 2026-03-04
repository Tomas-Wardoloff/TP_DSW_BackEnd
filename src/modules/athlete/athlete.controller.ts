import { NextFunction, Request, Response } from 'express';

import { AthleteService } from './athlete.service.js';
import { UpdateAthleteDto } from './athlete.dto.js';
import { BadRequestError, NotFoundError } from '../../shared/erros/http.erros.js';

export class AthleteController {
    private athleteService = new AthleteService();

    async findAll(req: Request, res: Response, next: NextFunction) {
        const athletes = await this.athleteService.findAll().catch(next);
        return res.status(200).json({ message: 'Athletes found', data: athletes });
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid athlete ID'));

        const athlete = await this.athleteService.findOne(id).catch(next);
        if (!athlete) return next(new NotFoundError('Athlete not found'));

        return res.status(200).json({ message: 'Athlete found', data: athlete });
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid athlete ID'));

        const payload = req.body as UpdateAthleteDto;
        const updatedAthlete = await this.athleteService.update(id, payload, req.user!.userId).catch(next);
        return res.status(200).json({ message: 'Athlete updated', data: updatedAthlete });
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid athlete ID'));

        await this.athleteService.delete(id, req.user!.userId).catch(next);
        return res.status(204).send();
    }
}
