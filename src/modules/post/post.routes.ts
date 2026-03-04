import { Router } from 'express';

import { PostController } from './post.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { CreatePostDto, UpdatePostDto } from './post.dto.js';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';

export default class PostRouter {
    private router = Router();
    private postController = new PostController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Feed general
        this.router.get('/', authMiddleware, (req, res) => this.postController.findAll(req, res));

        // Posts de un usuario específico
        this.router.get('/user/:userId', authMiddleware, (req, res) =>
            this.postController.findByUser(req, res)
        );

        // Detalle de un post con comentarios
        this.router.get('/:id', authMiddleware, (req, res) =>
            this.postController.findOne(req, res)
        );

        this.router.post('/', authMiddleware, validationMiddleware(CreatePostDto), (req, res) =>
            this.postController.create(req, res)
        );

        this.router.patch('/:id', authMiddleware, validationMiddleware(UpdatePostDto), (req, res) =>
            this.postController.update(req, res)
        );

        this.router.delete('/:id', authMiddleware, (req, res) =>
            this.postController.delete(req, res)
        );

        this.router.post('/:id/likes', authMiddleware, (req, res) =>
            this.postController.toggleLike(req, res)
        );

        // Comentarios anidados bajo el post
        this.router.post(
            '/:id/comments',
            authMiddleware,
            validationMiddleware(CreateCommentDto),
            (req, res) => this.postController.createComment(req, res)
        );

        this.router.patch(
            '/:id/comments/:commentId',
            authMiddleware,
            validationMiddleware(UpdateCommentDto),
            (req, res) => this.postController.updateComment(req, res)
        );

        this.router.delete('/:id/comments/:commentId', authMiddleware, (req, res) =>
            this.postController.deleteComment(req, res)
        );
    }

    public getRouter() {
        return this.router;
    }
}
