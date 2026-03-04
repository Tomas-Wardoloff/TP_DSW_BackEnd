import { NextFunction, Request, Response } from 'express';

import { FriendshipService } from './friendship.service.js';
import { CreateFriendshipDto, UpdateFriendshipDto } from './friendship.dto.js';
import { BadRequestError } from '../../shared/erros/http.erros.js';

export class FriendshipController {
    private friendshipService = new FriendshipService();

    async findFriends(req: Request, res: Response, next: NextFunction) {
        const friends = await this.friendshipService.findFriends(req.user!.userId).catch(next);
        return res.status(200).json({ message: 'Friends found', data: friends });
    }

    async findPendingReceived(req: Request, res: Response, next: NextFunction) {
        const requests = await this.friendshipService
            .findPendingReceived(req.user!.userId)
            .catch(next);
        return res.status(200).json({ message: 'Pending received requests found', data: requests });
    }

    async findPendingSent(req: Request, res: Response, next: NextFunction) {
        const requests = await this.friendshipService.findPendingSent(req.user!.userId).catch(next);
        return res.status(200).json({ message: 'Pending sent requests found', data: requests });
    }

    async sendRequest(req: Request, res: Response, next: NextFunction) {
        const payload = req.body as CreateFriendshipDto;
        const friendship = await this.friendshipService
            .sendRequest(payload, req.user!.userId)
            .catch(next);
        return res.status(201).json({ message: 'Friend request sent', data: friendship });
    }

    async respondToRequest(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        const payload = req.body as UpdateFriendshipDto;
        const friendship = await this.friendshipService
            .respondToRequest(id, payload, req.user!.userId)
            .catch(next);
        return res.status(200).json({ message: 'Friend request updated', data: friendship });
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        await this.friendshipService.remove(id, req.user!.userId).catch(next);
        return res.status(204).send();
    }
}
