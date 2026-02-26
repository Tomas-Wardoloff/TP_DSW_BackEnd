import { Request, Response } from "express";

import { PostService } from "./post.service.js";
import { CommentService } from "./comment.service.js";
import { CreatePostDto, UpdatePostDto } from "./post.dto.js";
import { CreateCommentDto, UpdateCommentDto } from "./comment.dto.js";

export class PostController {
    private postService = new PostService();   
    private commentService = new CommentService();

        async findAll(req: Request, res: Response) {
        try {
            const posts = await this.postService.findAll();
            return res.status(200).json({ message: 'Posts found', data: posts });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);
            
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const post = await this.postService.findOne(id);

            if (!post) return res.status(404).json({ message: 'Post not found' });

            return res.status(200).json({ message: 'Post found', data: post });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findByUser(req: Request, res: Response) {
        try {
            const userId = Number.parseInt(req.params.userId);

            if (isNaN(userId)) return res.status(400).json({ message: 'Invalid id' });

            const posts = await this.postService.findByUser(userId);
            return res.status(200).json({ message: 'Posts found', data: posts });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const payload = req.body as CreatePostDto;
            const post = await this.postService.create(
                payload,
                req.user!.userId
            );
            return res.status(201).json({ message: 'Post created', data: post });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const payload = req.body as UpdatePostDto;
            const post = await this.postService.update(
                id,
                payload,
                req.user!.userId
            );
            return res.status(200).json({ message: 'Post updated', data: post });
        } catch (error: any) {
            if (error.message === 'Post not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            await this.postService.delete(id, req.user!.userId);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Post not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async toggleLike(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const result = await this.postService.toggleLike(id, req.user!.userId);
            return res.status(200).json({ message: result.liked ? 'Post liked' : 'Post unliked', data: result });
        } catch (error: any) {
            if (error.message === 'Post not found')
                return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async createComment(req: Request, res: Response) {
        try {
            const postId = Number.parseInt(req.params.id);
            
            if (isNaN(postId)) return res.status(400).json({ message: 'Invalid id' });

            const payload = req.body as CreateCommentDto;
            const comment = await this.commentService.create(
                postId,
                payload,
                req.user!.userId
            );
            return res.status(201).json({ message: 'Comment created', data: comment });
        } catch (error: any) {
            if (error.message === 'Post not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Parent comment not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Cannot reply to a reply' ||
                error.message === 'Comment does not belong to this post')
                return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async updateComment(req: Request, res: Response) {
        try {
            const commentId = Number.parseInt(req.params.commentId);

            if (isNaN(commentId)) return res.status(400).json({ message: 'Invalid id' });

            const payload = req.body as UpdateCommentDto;
            const comment = await this.commentService.update(
                commentId,
                payload,
                req.user!.userId
            );
            return res.status(200).json({ message: 'Comment updated', data: comment });
        } catch (error: any) {
            if (error.message === 'Comment not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const commentId = Number.parseInt(req.params.commentId);

            if (isNaN(commentId)) return res.status(400).json({ message: 'Invalid id' });

            await this.commentService.delete(commentId, req.user!.userId);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Comment not found')
                return res.status(404).json({ message: error.message });
            if (error.message === 'Forbidden')
                return res.status(403).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
}