import { Request, Response } from 'express';

import { Club } from './club.entity.js';
import { ClubService } from './club.service.js';
//import { FilterQuery } from '@mikro-orm/core';


//async function findAll(req: Request, res: Response) {
//    try {
//        const { name } = req.query;
//        let filters: FilterQuery<Club> = {};
//
//        if (name) filters.name = { $like: `%${name}%` };
//
//        const clubs = await em.find(Club, filters, { populate: ['user'] });
//        res.status(200).json({ message: 'found all clubs', data: clubs });
//    } catch (error: any) {
//        res.status(500).json({ message: error.message });
//    }
//}

//async function add(req: Request, res: Response) {
//    try {
//        const { userId } = req.body;
//        const relatedUser = await em.findOneOrFail(User, { id: userId });
//        const existingClub = await em.findOne(Club, { user: relatedUser });
//        if (existingClub) {
//            res.status(409).json({ message: 'Club already exists' });
//        } else {
//            req.body.user = relatedUser;
//            const newClub = em.create(Club, req.body);
//            await em.flush();
//            res.status(201).json({ message: 'Club created', data: newClub });
//        }
//    } catch (error: any) {
//        res.status(500).json({ message: error.message });
//    }
//}

export class ClubController {
    private clubService = new ClubService();

    async findAll(req: Request, res: Response) {
        try {
            const clubs = await this.clubService.findAll();
            return res.status(200).json({ message: 'Found clubs', data: clubs });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });   
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            const club = await this.clubService.findOne(id);
            return res.status(200).json({ message: 'Found club', data: club });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const payload = req.body;
            const id = Number.parseInt(req.params.id);
            await this.clubService.update(id, payload);
            return res.status(200).json({ message: 'Club updated' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            await this.clubService.delete(id);
            return res.status(200).json({ message: 'Club removed' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}