import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../shared/db/orm.js', () => ({
    orm: {
        em: {
            fork: vi.fn(),
        },
    },
}));

import { orm } from '../../../shared/db/orm.js';
import { FriendshipService } from '../friendship.service.js';
import { FriendshipStatus } from '../friendship.entity.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../../shared/erros/http.erros.js';

describe('FriendshipService', () => {
    let friendshipService: FriendshipService;
    let mockEm: any;

    const mockRequester = { id: 1, email: 'requester@test.com' };
    const mockAddressee = { id: 2, email: 'addressee@test.com' };

    beforeEach(() => {
        mockEm = {
            findOne: vi.fn(),
            create: vi.fn().mockReturnValue({}),
            persist: vi.fn(),
            persistAndFlush: vi.fn().mockResolvedValue(undefined),
            flush: vi.fn().mockResolvedValue(undefined),
        };

        vi.mocked(orm.em.fork).mockReturnValue(mockEm);

        friendshipService = new FriendshipService();
    });

    describe('sendRequest', () => {
        it('should throw ConflictError if requester and addressee are the same user', async () => {
            // el usuario se manda una solicitud a sí mismo
            const dto = { addresseeId: 1 };
            const requesterId = 1;

            await expect(friendshipService.sendRequest(dto, requesterId)).rejects.toThrow(
                ConflictError
            );
            await expect(friendshipService.sendRequest(dto, requesterId)).rejects.toThrow(
                'Cannot send friend request to yourself'
            );

            expect(mockEm.findOne).not.toHaveBeenCalled();
        });

        it('should throw NotFoundError if addressee does not exist', async () => {
            // el destinatario no existe en la DB
            const dto = { addresseeId: 99 };
            const requesterId = 1;

            mockEm.findOne.mockResolvedValue(null);

            await expect(friendshipService.sendRequest(dto, requesterId)).rejects.toThrow(
                NotFoundError
            );
            await expect(friendshipService.sendRequest(dto, requesterId)).rejects.toThrow(
                'User not found'
            );
        });

        it('should throw ConflictError if a pending request already exists', async () => {
            // ya existe una solicitud pendiente entre estos usuarios
            const dto = { addresseeId: 2 };
            const requesterId = 1;

            // Primera llamada: addressee existe
            // Segunda llamada: requester existe
            // Tercera llamada: ya existe una friendship pendiente
            mockEm.findOne
                .mockResolvedValueOnce(mockAddressee)
                .mockResolvedValueOnce(mockRequester)
                .mockResolvedValueOnce({
                    id: 1,
                    status: FriendshipStatus.PENDING,
                    requester: mockRequester,
                    addressee: mockAddressee,
                });

            const promise = friendshipService.sendRequest(dto, requesterId);
            await expect(promise).rejects.toThrow(ConflictError);
            await expect(promise).rejects.toThrow('Friend request already sent');
        });

        it('should throw ConflictError if users are already friends', async () => {
            const dto = { addresseeId: 2 };
            const requesterId = 1;

            mockEm.findOne
                .mockResolvedValueOnce(mockAddressee)
                .mockResolvedValueOnce(mockRequester)
                .mockResolvedValueOnce({
                    id: 1,
                    status: FriendshipStatus.ACCEPTED,
                    requester: mockRequester,
                    addressee: mockAddressee,
                });

            const promise = friendshipService.sendRequest(dto, requesterId);
            await expect(promise).rejects.toThrow(ConflictError);
            await expect(promise).rejects.toThrow('Already friends');
        });

        it('should reset status to PENDING if previous request was rejected', async () => {
            // la solicitud fue rechazada antes, se puede reenviar
            const dto = { addresseeId: 2 };
            const requesterId = 1;

            const existingFriendship = {
                id: 1,
                status: FriendshipStatus.REJECTED,
                requester: mockAddressee, // el que rechazó era el requester original
                addressee: mockRequester,
            };

            mockEm.findOne
                .mockResolvedValueOnce(mockAddressee)
                .mockResolvedValueOnce(mockRequester)
                .mockResolvedValueOnce(existingFriendship);

            const result = await friendshipService.sendRequest(dto, requesterId);

            expect(existingFriendship.status).toBe(FriendshipStatus.PENDING);
            expect(mockEm.flush).toHaveBeenCalled();
        });
    });
});
