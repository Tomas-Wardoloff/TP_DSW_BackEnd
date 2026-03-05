import fs from 'fs';
import { EntityManager } from '@mikro-orm/mysql';

import { Post } from './post.entity.js';
import { Like } from './like.entity.js';
import { User } from '../user/user.entity.js';
import { orm } from '../../shared/db/orm.js';
import { CreatePostDto, UpdatePostDto } from './post.dto.js';
import { PostMedia, MediaType } from './post-media.entity.js';
import { ForbiddenError, NotFoundError } from '../../shared/erros/http.erros.js';
import { Friendship, FriendshipStatus } from '../friendship/friendship.entity.js';
import { PaginatedResult, PaginationDto } from '../../shared/dtos/pagination.dto.js';
import { buildPaginatedResult, getPaginationParams } from '../../shared/utils/pagination.helper.js';

export class PostService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findAll(
        requestingUserId: number,
        pagination: PaginationDto
    ): Promise<PaginatedResult<Post>> {
        const em = this.em;
        const { limit, offset } = getPaginationParams(pagination);

        // Primero obtenemos los IDs de los amigos del usuario.
        const friendships = await em.find(
            Friendship,
            {
                $or: [
                    { requester: { id: requestingUserId } },
                    { addressee: { id: requestingUserId } },
                ],
                status: FriendshipStatus.ACCEPTED,
            },
            {
                populate: ['requester', 'addressee'],
            }
        );

        // Extraemos los IDs del otro usuario en cada amistad, incluyendo al propio usuario para que vea sus propios posts
        const friendIds = [
            requestingUserId,
            ...friendships.map((f) =>
                f.requester.id === requestingUserId ? f.addressee.id : f.requester.id
            ),
        ];

        const where = { author: { id: { $in: friendIds } } };

        const [posts, total] = await Promise.all([
            em.find(Post, where, {
                populate: ['author', 'author.athleteProfile', 'author.clubProfile', 'author.agentProfile', 'likes', 'comments', 'content', 'media'],
                orderBy: { createdAt: 'DESC' },
                limit,
                offset,
            }),
            em.count(Post, where),
        ]);

        return buildPaginatedResult(posts, total, pagination);
    }

    async findOne(id: number): Promise<Post | null> {
        return this.em.findOne(
            Post,
            { id },
            {
                populate: [
                    'author',
                    'likes',
                    'comments',
                    'comments.author',
                    'comments.author.athleteProfile',
                    'comments.author.clubProfile',
                    'comments.author.agentProfile',
                    'comments.replies',
                    'comments.replies.author',
                ],
            }
        );
    }

    async findByUser(userId: number, pagination: PaginationDto): Promise<PaginatedResult<Post>> {
        const em = this.em;
        const { limit, offset } = getPaginationParams(pagination);
        const where = { author: { id: userId } };

        const [posts, total] = await Promise.all([
            em.find(Post, where, {
                populate: ['author', 'author.athleteProfile', 'author.clubProfile', 'author.agentProfile', 'likes', 'comments', 'content', 'media'],
                orderBy: { createdAt: 'DESC' },
                limit,
                offset,
            }),
            em.count(Post, where),
        ]);

        return buildPaginatedResult(posts, total, pagination);
    }

    async create(postData: CreatePostDto, authorId: number,  files: Express.Multer.File[]): Promise<Post> {
        const em = this.em;

        const author = await em.findOne(User, { id: authorId });
        if (!author) throw new NotFoundError('User not found');

        const post = em.create(Post, {
            content: postData.content,
            author,
        });

        em.persist(post)

        // Creamos un registro PostMedia por cada archivo subido
        files.forEach((file, index) => {
            const postMedia = em.create(PostMedia, {
                // Guardamos la ruta relativa. El frontend construye la URL completa usando la base URL del servidor.
                url: `uploads/posts/${file.filename}`,
                type: MediaType.IMAGE,
                originalName: file.originalname,
                order: index,
                post,
            });

            em.persist(postMedia);
        });

        await em.flush();
        await em.populate(post, ['media', 'author']);
        return post;
    }

    async update(id: number, updateData: UpdatePostDto, requestingUserId: number): Promise<Post> {
        const em = this.em;

        const post = await em.findOne(Post, { id }, { populate: ['author'] });

        if (!post) throw new NotFoundError('Post not found');

        if (post.author.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        post.content = updateData.content;
        await em.flush();
        return post;
    }

    async delete(id: number, requestingUserId: number): Promise<void> {
        const em = this.em;

        const post = await em.findOne(Post, { id }, { populate: ['author', 'media'] });
        if (!post) throw new NotFoundError('Post not found');
        if (post.author.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        // Eliminamos los archivos del disco antes del soft delete
        for (const media of post.media) {
            if (fs.existsSync(media.url)) {
                fs.unlinkSync(media.url);
            }
        }

        post.deletedAt = new Date();
        await em.flush();
    }

    async toggleLike(
        postId: number,
        requestingUserId: number
    ): Promise<{ liked: boolean; totalLikes: number }> {
        const em = this.em;

        const post = await em.findOne(Post, { id: postId });
        if (!post) throw new NotFoundError('Post not found');

        const author = await em.findOne(User, { id: requestingUserId });
        if (!author) throw new NotFoundError('User not found');

        const existingLike = await em.findOne(Like, {
            author: { id: requestingUserId },
            post: { id: postId },
        });

        if (existingLike) {
            // Si ya le dio like, lo quitamos (unlike)
            await em.removeAndFlush(existingLike);
            const totalLikes = await em.count(Like, { post: { id: postId } });
            return { liked: false, totalLikes };
        } else {
            // Si no le dio like, lo agregamos
            const like = em.create(Like, { author, post });
            await em.persistAndFlush(like);
            const totalLikes = await em.count(Like, { post: { id: postId } });
            return { liked: true, totalLikes };
        }
    }
}
