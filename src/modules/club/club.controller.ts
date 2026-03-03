import { Request, Response } from 'express';

import { ClubService } from './club.service.js';
import { UpdateClubDto } from './club.dto.js';

export class ClubController {
    private clubService = new ClubService();

    async findAll(req: Request, res: Response) {
        try {
            const clubs = await this.clubService.findAll();
            return res.status(200).json({ message: 'Clubs found', data: clubs });
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

            const club = await this.clubService.findOne(id);
            if (!club) {
                return res.status(404).json({ message: 'Club not found' });
            }

            return res.status(200).json({ message: 'Club found', data: club });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const payload = req.body as UpdateClubDto;
            const updatedClub = await this.clubService.update(id, payload, req.user!.userId);
            return res.status(200).json({ message: 'Club updated', data: updatedClub });
        } catch (error: any) {
            if (error.message === 'Club not found')
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

            await this.clubService.delete(id, req.user!.userId);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Club not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
}
