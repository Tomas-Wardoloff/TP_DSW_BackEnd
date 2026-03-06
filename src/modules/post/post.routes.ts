import { Router } from 'express';

import { PostController } from './post.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { UpdatePostDto } from './post.dto.js';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';
import { uploadMiddleware } from '../../shared/middleware/upload.middleware.js';

export default class PostRouter {
    private router = Router();
    private postController = new PostController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Feed general
        this.router.get('/', authMiddleware, (req, res, next) =>
            this.postController.findAll(req, res, next)
        );

        // Posts de un usuario específico
        this.router.get('/user/:userId', authMiddleware, (req, res, next) =>
            this.postController.findByUser(req, res, next)
        );

        // Detalle de un post con comentarios
        this.router.get('/:id', authMiddleware, (req, res, next) =>
            this.postController.findOne(req, res, next)
        );

        this.router.post(
            '/',
            authMiddleware,
            uploadMiddleware.array('media', 4),
            (req, res, next) => this.postController.create(req, res, next)
        );

        this.router.patch(
            '/:id',
            authMiddleware,
            validationMiddleware(UpdatePostDto),
            (req, res, next) => this.postController.update(req, res, next)
        );

        this.router.delete('/:id', authMiddleware, (req, res, next) =>
            this.postController.delete(req, res, next)
        );

        this.router.post('/:id/likes', authMiddleware, (req, res, next) =>
            this.postController.toggleLike(req, res, next)
        );

        // Comentarios anidados bajo el post
        this.router.post(
            '/:id/comments',
            authMiddleware,
            validationMiddleware(CreateCommentDto),
            (req, res, next) => this.postController.createComment(req, res, next)
        );

        this.router.patch(
            '/:id/comments/:commentId',
            authMiddleware,
            validationMiddleware(UpdateCommentDto),
            (req, res, next) => this.postController.updateComment(req, res, next)
        );

        this.router.delete('/:id/comments/:commentId', authMiddleware, (req, res, next) =>
            this.postController.deleteComment(req, res, next)
        );
    }

    public getRouter() {
        return this.router;
    }
}
