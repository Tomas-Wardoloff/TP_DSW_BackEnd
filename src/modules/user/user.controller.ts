import { Request, Response } from 'express';

import { UserService } from './user.service.js';
import { UserType } from './user.entity.js';
import { CreateUserDto, UpdateUserDto } from './user.dto.js';
//import { AuthService } from '../../shared/services/auth.service.js';

export class UserController {
    private userService = new UserService();
//    private authService = new AuthService();

    /**
     * Login: Valida credenciales y retorna JWT
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required',
                });
            }

            const user = await this.userService.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid credentials',
                });
            }

            const isPasswordValid = await this.authService.comparePasswords(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return res.status(401).json({
                    message: 'Invalid credentials',
                });
            }

            const token = this.authService.generateToken({
                id: user.id,
                email: user.email,
            });

            return res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    userType: user.userType,
                },
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    /**
     * Get profile: Retorna datos del usuario autenticado

    async getProfile(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const user = await this.userService.findOne(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'Profile retrieved',
                data: {
                    id: user.id,
                    email: user.email,
                    userType: user.userType,
                    phoneNumber: user.phoneNumber,
                    createdAt: user.createdAt,
                },
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }     */

    async findAll(req: Request, res: Response) {
        try {
            const userType = req.query.userType as UserType | undefined;
            const users = await this.userService.findAll(userType);
            return res.status(200).json({ message: 'Users found', data: users });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id)) 
                return res.status(400).json({ message: 'Invalid user ID' });

            const user = await this.userService.findOne(id);

            if (!user) 
                return res.status(404).json({ message: 'User not found' });

            return res.status(200).json({ message: 'User found', data: user });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const payload = req.body as CreateUserDto;
            const newUser = await this.userService.create(payload);
            return res.status(201).json({ message: 'User created', data: newUser });
        } catch (error: any) {
            if (error.message === 'User already exists')
                return res.status(409).json({ message: error.message });
            if (error.message === 'Profile data is required')
                return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id))
                return res.status(400).json({ message: 'Invalid user ID' });
            
            const payload = req.body as UpdateUserDto;
            const updatedUser = await this.userService.update(id, payload);
            return res.status(200).json({ message: 'User updated', data: updatedUser });
        } catch (error: any) {
            if (error.message === 'User not found') 
                return res.status(404).json({ message: error.message });
            if (error.message === 'Email is already taken')
                return res.status(409).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number.parseInt(req.params.id);

            if (isNaN(id))
                return res.status(400).json({ message: 'Invalid user ID' });
            
            await this.userService.delete(id);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message === 'User not found') 
                return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
}
