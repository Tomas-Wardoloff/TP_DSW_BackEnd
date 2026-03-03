import { Request, Response } from 'express';

import { SportService } from './sport.service.js';

export class SportController {
    private sportService = new SportService();

    async findAllSports(req: Request, res: Response) {
        try {
            const sports = await this.sportService.findAllSports();
            return res.status(200).json({ message: 'Sports found', data: sports });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOneSport(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const sport = await this.sportService.findOneSport(id);

            if (!sport) return res.status(404).json({ message: 'Sport not found' });

            return res.status(200).json({ message: 'Sport found', data: sport });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findAllPositions(req: Request, res: Response) {
        try {
            const sportId = req.query.sportId
                ? Number.parseInt(req.query.sportId as string)
                : undefined;

            if (req.query.sportId && isNaN(sportId!))
                return res.status(400).json({ message: 'Invalid sportId' });

            const positions = await this.sportService.findAllPositions(sportId);
            return res.status(200).json({ message: 'Positions found', data: positions });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOnePosition(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const position = await this.sportService.findOnePosition(id);

            if (!position) return res.status(404).json({ message: 'Position not found' });

            return res.status(200).json({ message: 'Position found', data: position });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
