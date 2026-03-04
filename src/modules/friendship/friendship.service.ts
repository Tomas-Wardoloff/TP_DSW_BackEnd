import { EntityManager } from '@mikro-orm/mysql';

import { orm } from '../../shared/db/orm.js';
import { User } from '../user/user.entity.js';
import { Friendship, FriendshipStatus } from './friendship.entity.js';
import { CreateFriendshipDto, UpdateFriendshipDto } from './friendship.dto.js';
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from '../../shared/erros/http.erros.js';

export class FriendshipService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findFriends(userId: number): Promise<Friendship[]> {
        return this.em.find(
            Friendship,
            {
                $or: [{ requester: { id: userId } }, { addressee: { id: userId } }],
                status: FriendshipStatus.ACCEPTED,
            },
            {
                populate: ['requester', 'addressee'],
            }
        );
    }

    async findPendingReceived(userId: number): Promise<Friendship[]> {
        return this.em.find(
            Friendship,
            {
                addressee: { id: userId },
                status: FriendshipStatus.PENDING,
            },
            {
                populate: ['requester'],
            }
        );
    }

    async findPendingSent(userId: number): Promise<Friendship[]> {
        return this.em.find(
            Friendship,
            {
                requester: { id: userId },
                status: FriendshipStatus.PENDING,
            },
            {
                populate: ['addressee'],
            }
        );
    }

    async sendRequest(
        friendshipData: CreateFriendshipDto,
        requesterId: number
    ): Promise<Friendship> {
        const em = this.em;

        // No podés mandarte una solicitud a vos mismo
        if (requesterId === friendshipData.addresseeId) {
            throw new ConflictError('Cannot send friend request to yourself');
        }

        const addressee = await em.findOne(User, { id: friendshipData.addresseeId });
        if (!addressee) throw new NotFoundError('User not found');

        const requester = await em.findOne(User, { id: requesterId });
        if (!requester) throw new NotFoundError('User not found');

        // Buscamos si ya existe una relación entre estos dos usuarios
        const existing = await em.findOne(Friendship, {
            $or: [
                { requester: { id: requesterId }, addressee: { id: friendshipData.addresseeId } },
                { requester: { id: friendshipData.addresseeId }, addressee: { id: requesterId } },
            ],
        });

        if (existing) {
            if (existing.status === FriendshipStatus.PENDING)
                throw new ConflictError('Friend request already sent');
            if (existing.status === FriendshipStatus.ACCEPTED)
                throw new ConflictError('Already friends');

            // Si fue REJECTED, permitimos reenviar la solicitud
            if (existing.status === FriendshipStatus.REJECTED) {
                existing.status = FriendshipStatus.PENDING;
                // Nos aseguramos que el requester sea quien reenvía, no quien rechazó originalmente
                existing.requester = requester;
                existing.addressee = addressee;
                await em.flush();
                return existing;
            }
        }

        const friendship = em.create(Friendship, {
            requester,
            addressee,
            status: FriendshipStatus.PENDING,
        });

        await em.persistAndFlush(friendship);
        return friendship;
    }

    async respondToRequest(
        friendshipId: number,
        updateData: UpdateFriendshipDto,
        requestingUserId: number
    ): Promise<Friendship> {
        const em = this.em;

        const friendship = await em.findOne(
            Friendship,
            { id: friendshipId },
            {
                populate: ['requester', 'addressee'],
            }
        );

        if (!friendship) throw new NotFoundError('Friend request not found');

        if (friendship.addressee.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        if (friendship.status !== FriendshipStatus.PENDING)
            throw new BadRequestError('Friend request is no longer pending');

        friendship.status = updateData.status;
        await em.flush();
        return friendship;
    }

    // Eliminar una amistad o cancelar una solicitud pendiente.
    async remove(friendshipId: number, requestingUserId: number): Promise<void> {
        const em = this.em;

        const friendship = await em.findOne(
            Friendship,
            { id: friendshipId },
            {
                populate: ['requester', 'addressee'],
            }
        );

        if (!friendship) throw new NotFoundError('Friend request not found');

        // Solo los involucrados pueden eliminar la relación
        if (
            friendship.requester.id !== requestingUserId &&
            friendship.addressee.id !== requestingUserId
        ) {
            throw new ForbiddenError('Forbidden');
        }

        // Usamos remove físico en lugar de soft delete porque no
        await em.removeAndFlush(friendship);
    }
}
