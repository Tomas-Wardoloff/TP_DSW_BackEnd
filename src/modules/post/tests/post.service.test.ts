import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../shared/db/orm.js', () => ({
    orm: {
        em: {
            fork: vi.fn(),
        },
    },
}));

import { orm } from '../../../shared/db/orm.js';
import { PostService } from '../post.service.js';
import { NotFoundError } from '../../../shared/erros/http.erros.js';

describe('PostService', () => {
    let postService: PostService;
    let mockEm: any;

    const mockPost = { id: 1, content: 'Test post' };
    const mockUser = { id: 1, email: 'user@test.com' };
    const mockLike = { id: 1, author: mockUser, post: mockPost };

    beforeEach(() => {
        mockEm = {
            findOne: vi.fn(),
            create: vi.fn().mockReturnValue(mockLike),
            persist: vi.fn(),
            persistAndFlush: vi.fn().mockResolvedValue(undefined),
            removeAndFlush: vi.fn().mockResolvedValue(undefined),
            count: vi.fn(),
        };

        vi.mocked(orm.em.fork).mockReturnValue(mockEm);

        postService = new PostService();
    });

    describe('toggleLike', () => {
        it('should throw NotFoundError if post does not exist', async () => {
            // post no existe
            mockEm.findOne.mockResolvedValue(null);

            await expect(postService.toggleLike(99, 1)).rejects.toThrow(NotFoundError);
            await expect(postService.toggleLike(99, 1)).rejects.toThrow('Post not found');
        });

        it('should add like if user has not liked the post yet', async () => {
            // el post existe, el user existe, no hay like previo
            mockEm.findOne
                .mockResolvedValueOnce(mockPost) // findOne(Post)
                .mockResolvedValueOnce(mockUser) // findOne(User)
                .mockResolvedValueOnce(null); // findOne(Like) — no existe

            mockEm.count.mockResolvedValue(1);

            const result = await postService.toggleLike(1, 1);

            expect(result.liked).toBe(true);
            expect(result.totalLikes).toBe(1);
            expect(mockEm.persistAndFlush).toHaveBeenCalled();
            expect(mockEm.removeAndFlush).not.toHaveBeenCalled();
        });

        it('should remove like if user already liked the post', async () => {
            // el post existe, el user existe, y ya hay un like
            mockEm.findOne
                .mockResolvedValueOnce(mockPost) // findOne(Post)
                .mockResolvedValueOnce(mockUser) // findOne(User)
                .mockResolvedValueOnce(mockLike); // findOne(Like) — existe

            mockEm.count.mockResolvedValue(0);

            const result = await postService.toggleLike(1, 1);

            expect(result.liked).toBe(false);
            expect(result.totalLikes).toBe(0);
            expect(mockEm.removeAndFlush).toHaveBeenCalledWith(mockLike);
            expect(mockEm.persistAndFlush).not.toHaveBeenCalled();
        });

        it('should return correct totalLikes count after toggling', async () => {
            // simulamos 5 likes existentes después de agregar uno
            mockEm.findOne
                .mockResolvedValueOnce(mockPost)
                .mockResolvedValueOnce(mockUser)
                .mockResolvedValueOnce(null);

            mockEm.count.mockResolvedValue(5);

            const result = await postService.toggleLike(1, 1);

            expect(result.totalLikes).toBe(5);
            expect(mockEm.count).toHaveBeenCalledWith(expect.anything(), { post: { id: 1 } });
        });
    });
});
