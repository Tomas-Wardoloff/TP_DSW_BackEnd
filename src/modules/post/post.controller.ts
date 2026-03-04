import { NextFunction, Request, Response } from 'express';

import { PostService } from './post.service.js';
import { CommentService } from './comment.service.js';
import { CreatePostDto, UpdatePostDto } from './post.dto.js';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto.js';
import { PaginationDto } from '../../shared/dtos/pagination.dto.js';
import { BadRequestError, NotFoundError } from '../../shared/erros/http.erros.js';

export class PostController {
    private postService = new PostService();
    private commentService = new CommentService();

    async findAll(req: Request, res: Response, next: NextFunction) {
        const pagination: PaginationDto = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
        };

        const posts = await this.postService.findAll(req.user!.userId, pagination).catch(next);
        return res.status(200).json({ message: 'Posts found', data: posts });
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        const post = await this.postService.findOne(id);
        if (!post) return next(new NotFoundError('Post not found'));

        return res.status(200).json({ message: 'Post found', data: post });
    }

    async findByUser(req: Request, res: Response, next: NextFunction) {
        const userId = Number.parseInt(req.params.userId);
        if (isNaN(userId)) return next(new BadRequestError('Invalid id'));

        const pagination: PaginationDto = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
        };

        const posts = await this.postService.findByUser(userId, pagination).catch(next);
        return res.status(200).json({ message: 'Posts found', data: posts });
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const payload = req.body as CreatePostDto;
        const post = await this.postService.create(payload, req.user!.userId).catch(next);
        return res.status(201).json({ message: 'Post created', data: post });
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        const payload = req.body as UpdatePostDto;
        const post = await this.postService.update(id, payload, req.user!.userId).catch(next);
        return res.status(200).json({ message: 'Post updated', data: post });
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        await this.postService.delete(id, req.user!.userId);
        return res.status(204).send();
    }

    async toggleLike(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id);
        if (isNaN(id)) return next(new BadRequestError('Invalid id'));

        const result = await this.postService.toggleLike(id, req.user!.userId).catch(next);

        if (!result) return;

        return res
            .status(200)
            .json({ message: result.liked ? 'Post liked' : 'Post unliked', data: result });
    }

    async createComment(req: Request, res: Response, next: NextFunction) {
        const postId = Number.parseInt(req.params.id);
        if (isNaN(postId)) return next(new BadRequestError('Invalid id'));

        const payload = req.body as CreateCommentDto;
        const comment = await this.commentService
            .create(postId, payload, req.user!.userId)
            .catch(next);
        return res.status(201).json({ message: 'Comment created', data: comment });
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        const commentId = Number.parseInt(req.params.commentId);
        if (isNaN(commentId)) return next(new BadRequestError('Invalid id'));

        const payload = req.body as UpdateCommentDto;
        const comment = await this.commentService
            .update(commentId, payload, req.user!.userId)
            .catch(next);
        return res.status(200).json({ message: 'Comment updated', data: comment });
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        const commentId = Number.parseInt(req.params.commentId);
        if (isNaN(commentId)) return next(new BadRequestError('Invalid id'));

        await this.commentService.delete(commentId, req.user!.userId).catch(next);
        return res.status(204).send();
    }
}
