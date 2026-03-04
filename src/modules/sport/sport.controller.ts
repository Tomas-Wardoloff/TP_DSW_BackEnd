import { NextFunction, Request, Response } from 'express';

import { SportService } from './sport.service.js';
import { BadRequestError, NotFoundError } from '../../shared/erros/http.erros.js';

export class SportController {
    private sportService = new SportService();

    async findAllSports(req: Request, res: Response, next: NextFunction) {
        const sports = await this.sportService.findAllSports().catch(next);
        return res.status(200).json({ message: 'Sports found', data: sports });
    }

    async findOneSport(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        const sport = await this.sportService.findOneSport(id).catch(next);
        if (!sport) return next(new NotFoundError('Sport not found'));

        return res.status(200).json({ message: 'Sport found', data: sport });
    }

    async findAllPositions(req: Request, res: Response, next: NextFunction) {
        const sportId = req.query.sportId
            ? Number.parseInt(req.query.sportId as string)
            : undefined;

        if (req.query.sportId && isNaN(sportId!))
            return next(new BadRequestError('Invalid sportId'));

        const positions = await this.sportService.findAllPositions(sportId).catch(next);
        return res.status(200).json({ message: 'Positions found', data: positions });
    }

    async findOnePosition(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        const position = await this.sportService.findOnePosition(id).catch(next);

        if (!position) return next(new NotFoundError('Position not found'));

        return res.status(200).json({ message: 'Position found', data: position });
    }
}
