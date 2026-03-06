import { NextFunction, Request, Response } from 'express';

import { ClubService } from './club.service.js';
import { FilterClubDto, UpdateClubDto } from './club.dto.js';
import { BadRequestError, NotFoundError } from '../../shared/erros/http.erros.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ClubController {
    private clubService = new ClubService();

    async findAll(req: Request, res: Response, next: NextFunction) {
        const filters = plainToInstance(FilterClubDto, req.query);

        const errors = await validate(filters);
        if (errors.length > 0) return next(new BadRequestError('Invalid filter parameters'));

        const clubs = await this.clubService.findAll(filters).catch(next);
        return res.status(200).json({ message: 'Clubs found', data: clubs });
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        const club = await this.clubService.findOne(id).catch(next);
        if (!club) return next(new NotFoundError('Club not found'));

        return res.status(200).json({ message: 'Club found', data: club });
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        const payload = req.body as UpdateClubDto;
        const updatedClub = await this.clubService
            .update(id, payload, req.user!.userId)
            .catch(next);
        return res.status(200).json({ message: 'Club updated', data: updatedClub });
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        await this.clubService.delete(id, req.user!.userId).catch(next);
        return res.status(204).send();
    }
}
