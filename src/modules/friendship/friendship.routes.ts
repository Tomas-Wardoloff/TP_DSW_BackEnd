import { Router } from 'express';

import { authMiddleware } from '../auth/auth.middleware.js';
import { FriendshipController } from './friendship.controller.js';
import { CreateFriendshipDto, UpdateFriendshipDto } from './friendship.dto.js';
import { validationMiddleware } from '../../shared/middleware/validation.middleware.js';

export default class FriendshipRouter {
    private router = Router();
    private friendshipController = new FriendshipController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Amistades aceptadas del usuario autenticado
        this.router.get('/friends',
            authMiddleware,
            (req, res) => this.friendshipController.findFriends(req, res)
        );

        // Solicitudes recibidas pendientes
        this.router.get('/pending/received',
            authMiddleware,
            (req, res) => this.friendshipController.findPendingReceived(req, res)
        );

        // Solicitudes enviadas pendientes
        this.router.get('/pending/sent',
            authMiddleware,
            (req, res) => this.friendshipController.findPendingSent(req, res)
        );

        // Enviar solicitud de amistad
        this.router.post('/',
            authMiddleware,
            validationMiddleware(CreateFriendshipDto),
            (req, res) => this.friendshipController.sendRequest(req, res)
        );

        // Aceptar o rechazar una solicitud recibida
        this.router.patch('/:id',
            authMiddleware,
            validationMiddleware(UpdateFriendshipDto),
            (req, res) => this.friendshipController.respondToRequest(req, res)
        );

        // Eliminar amistad o cancelar solicitud pendiente
        this.router.delete('/:id',
            authMiddleware,
            (req, res) => this.friendshipController.remove(req, res)
        );
    }

    public getRouter() {
        return this.router;
    }
}