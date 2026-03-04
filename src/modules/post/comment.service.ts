import { EntityManager } from '@mikro-orm/core';

import { Post } from './post.entity.js';
import { orm } from '../../shared/db/orm.js';
import { User } from '../user/user.entity.js';
import { Comment } from './comment.entity.js';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../shared/erros/http.erros.js';

export class CommentService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async create(
        postId: number,
        commentData: CreateCommentDto,
        authorId: number
    ): Promise<Comment> {
        const em = this.em;

        const post = await em.findOne(Post, { id: postId });
        if (!post) throw new NotFoundError('Post not found');

        const author = await em.findOne(User, { id: authorId });
        if (!author) throw new NotFoundError('User not found');

        let parentComment: Comment | undefined;

        if (commentData.parentCommentId) {
            const parent = await em.findOne(Comment, { id: commentData.parentCommentId });
            if (!parent) throw new NotFoundError('Parent comment not found');

            // Evitamos más de un nivel de anidado: un reply no puede
            // tener replies. Si el padre ya es un reply, rechazamos.
            if (parent.parentComment) throw new BadRequestError('Cannot reply to a reply');

            // El reply debe pertenecer al mismo post
            if (parent.post.id !== postId)
                throw new BadRequestError('Comment does not belong to this post');

            parentComment = parent;
        }

        const comment = em.create(Comment, {
            content: commentData.content,
            author,
            post,
            ...(parentComment && { parentComment }),
        });

        await em.persistAndFlush(comment);

        await em.populate(comment, ['author']);
        return comment;
    }

    async update(
        commentId: number,
        updateData: UpdateCommentDto,
        requestingUserId: number
    ): Promise<Comment> {
        const em = this.em;

        const comment = await em.findOne(
            Comment,
            { id: commentId },
            {
                populate: ['author'],
            }
        );

        if (!comment) throw new NotFoundError('Comment not found');

        if (comment.author.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        comment.content = updateData.content;
        await em.flush();
        return comment;
    }

    async delete(commentId: number, requestingUserId: number): Promise<void> {
        const em = this.em;

        const comment = await em.findOne(
            Comment,
            { id: commentId },
            {
                populate: ['author'],
            }
        );
        if (!comment) throw new NotFoundError('Comment not found');

        if (comment.author.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        comment.deletedAt = new Date();
        await em.flush();
    }
}
