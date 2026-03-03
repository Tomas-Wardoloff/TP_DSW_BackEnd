import { Request, Response } from 'express';

import { FriendshipService } from './friendship.service.js';
import { CreateFriendshipDto, UpdateFriendshipDto } from './friendship.dto.js';

export class FriendshipController {
    private friendshipService = new FriendshipService();

    async findFriends(req: Request, res: Response) {
        try {
            const friends = await this.friendshipService.findFriends(req.user!.userId);
            return res.status(200).json({ message: 'Friends found', data: friends });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findPendingReceived(req: Request, res: Response) {
        try {
            const requests = await this.friendshipService.findPendingReceived(req.user!.userId);
            return res.status(200).json({ message: 'Pending received requests found', data: requests });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findPendingSent(req: Request, res: Response) {
        try {
            const requests = await this.friendshipService.findPendingSent(req.user!.userId);
            return res.status(200).json({ message: 'Pending sent requests found', data: requests });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async sendRequest(req: Request, res: Response) {
        try {
            const payload = req.body as CreateFriendshipDto;
            const friendship = await this.friendshipService.sendRequest(
                payload,
                req.user!.userId
            );
            return res.status(201).json({ message: 'Friend request sent', data: friendship });
        } catch (error: any) {
            if (error.message === 'User not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Cannot send friend request to yourself' ||
                error.message === 'Friend request already sent' ||
                error.message === 'Already friends')
                return res.status(409).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async respondToRequest(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const payload = req.body as UpdateFriendshipDto;
            const friendship = await this.friendshipService.respondToRequest(
                id,
                payload,
                req.user!.userId
            );
            return res.status(200).json({ message: 'Friend request updated', data: friendship });
        } catch (error: any) {
            if (error.message === 'Friend request not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            if (error.message === 'Friend request is no longer pending' ||
                error.message === 'Invalid status')
                return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            await this.friendshipService.remove(id, req.user!.userId);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Friend request not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
}