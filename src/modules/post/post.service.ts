import { EntityManager } from "@mikro-orm/mysql";

import { Post } from "./post.entity.js";
import { Like } from "./like.entity.js";
import { User } from "../user/user.entity.js";
import { orm } from "../../shared/db/orm.js";
import { CreatePostDto, UpdatePostDto } from "./post.dto.js";

export class PostService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findAll(): Promise<Post[]> {
        return this.em.find(Post, {}, {
            populate: ['author', 'likes'],
            orderBy: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Post | null> {
        return this.em.findOne(Post, { id }, {
            populate: [
                'author',
                'likes',
                'comments',
                'comments.author',
                'comments.replies',
                'comments.replies.author',
            ],
        });
    }

    async findByUser(userId: number): Promise<Post[]> {
        return this.em.find(Post, { author: { id: userId } }, {
            populate: ['author', 'likes'],
            orderBy: { createdAt: 'DESC' },
        });
    }

    async create(postData: CreatePostDto, authorId: number): Promise<Post> {
        const em = this.em;

        const author = await em.findOne(User, { id: authorId });
        if (!author) throw new Error('User not found');

        const post = em.create(Post, {
            content: postData.content,
            author,
        });

        await em.persistAndFlush(post);
        return post;
    }

    async update(id: number, updateData: UpdatePostDto, requestingUserId: number): Promise<Post> {
        const em = this.em;

        const post = await em.findOne(Post, { id }, { populate: ['author'] });

        if (!post) throw new Error('Post not found');

        if (post.author.id !== requestingUserId) throw new Error('Forbidden');

        post.content = updateData.content;
        await em.flush();
        return post;
    }

    async delete(id: number, requestingUserId: number): Promise<void> {
        const em = this.em;

        const post = await em.findOne(Post, { id }, { populate: ['author'] });

        if (!post) throw new Error('Post not found');

        if (post.author.id !== requestingUserId) throw new Error('Forbidden');

        post.deletedAt = new Date();
        await em.flush();
    }

    async toggleLike(postId: number, requestingUserId: number): Promise<{ liked: boolean; totalLikes: number }> {
        const em = this.em;

        const post = await em.findOne(Post, { id: postId });
        if (!post) throw new Error('Post not found');

        const author = await em.findOne(User, { id: requestingUserId });
        if (!author) throw new Error('User not found');

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