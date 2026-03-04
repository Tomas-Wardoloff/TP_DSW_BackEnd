import { NextFunction, Request, Response } from 'express';

import { UserService } from './user.service.js';
import { UserType } from './user.entity.js';
import { CreateUserDto, UpdateUserDto } from './user.dto.js';
import { BadRequestError, NotFoundError } from '../../shared/erros/http.erros.js';

export class UserController {
    private userService = new UserService();

    async findAll(req: Request, res: Response, next: NextFunction) {
        const userType = req.query.userType as UserType | undefined;
        const users = await this.userService.findAll(userType).catch(next);
        return res.status(200).json({ message: 'Users found', data: users });
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid user ID'));

        const user = await this.userService.findOne(id).catch(next);
        if (!user) return next(new NotFoundError('User not found'));

        return res.status(200).json({ message: 'User found', data: user });
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const payload = req.body as CreateUserDto;
        const newUser = await this.userService.create(payload).catch(next);
        return res.status(201).json({ message: 'User created', data: newUser });
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid user ID'));

        const payload = req.body as UpdateUserDto;
        const updatedUser = await this.userService
            .update(id, payload, req.user!.userId)
            .catch(next);
        return res.status(200).json({ message: 'User updated', data: updatedUser });
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid user ID'));

        await this.userService.delete(id, req.user!.userId).catch(next);
        return res.status(204).send();
    }
}
