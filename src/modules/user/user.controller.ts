import { Request, Response } from 'express';

import { UserService } from './user.service.js';

export class UserController {
    private userService = new UserService();

    async findAll(req: Request, res: Response) {
        try {
            const users = await this.userService.findAll(req.query.userType as any);
            return res.status(200).json({ message: 'Users found', data: users });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            const user = await this.userService.findOne(id);
            return res.status(200).json({ message: 'found user', data: user });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const payload = req.body;
            const newUser = await this.userService.create(payload);
            return res.status(201).json({ message: 'User created', data: newUser });
        } catch (error: any) {
            if (error.message === 'User already exists')
                return res.status(409).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const payload = req.body;
            const id = Number.parseInt(req.params.id);
            await this.userService.update(id, payload);
            return res.status(200).json({ message: 'User updated' });
        } catch (error: any) {
            if (error.message === 'Email is already taken')
                return res.status(409).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            await this.userService.delete(id);
            return res.status(200).json({ message: 'User removed' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
