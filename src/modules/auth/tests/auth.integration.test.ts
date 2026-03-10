import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { describe, it, expect, vi, beforeEach } from 'vitest';

dotenv.config();

// Mockeamos el orm 
vi.mock('../../../shared/db/orm.js', () => ({
    orm: {
        em: {
            fork: vi.fn(),
        },
    },
}));

// Mockeamos bcrypt 
vi.mock('bcrypt', () => ({
    default: {
        compare: vi.fn(),
        hash: vi.fn().mockResolvedValue('hashed_password'),
    },
}));

import { orm } from '../../../shared/db/orm.js';
import { AuthService } from '../auth.service.js';
import { JwtHelper } from '../../../shared/utils/jwt.helper.js';
import { UnauthorizedError } from '../../../shared/erros/http.erros.js';
import { UserType } from '../../user/user.entity.js';

describe('AuthService — login integration', () => {
    let authService: AuthService;
    let mockEm: any;

    const mockUser = {
        id: 1,
        email: 'atleta@sportlink.com',
        password: 'hashed_password',
        userType: UserType.ATHLETE,
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockEm = {
            findOne: vi.fn(),
            create: vi.fn().mockReturnValue({}),
            persistAndFlush: vi.fn().mockResolvedValue(undefined),
            flush: vi.fn().mockResolvedValue(undefined),
        };

        vi.mocked(orm.em.fork).mockReturnValue(mockEm);

        authService = new AuthService();
    });

    describe('login', () => {
        it('should return accessToken and refreshToken on valid credentials', async () => {
            // usuario existe y contraseña es válida
            mockEm.findOne.mockResolvedValue(mockUser);
            vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

            const result = await authService.login({
                email: 'atleta@sportlink.com',
                password: 'password123',
            });

            // verifica que devuelve los dos tokens
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(typeof result.accessToken).toBe('string');
            expect(typeof result.refreshToken).toBe('string');
        });

        it('should return tokens that are valid JWTs', async () => {
            mockEm.findOne.mockResolvedValue(mockUser);
            vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

            const result = await authService.login({
                email: 'atleta@sportlink.com',
                password: 'password123',
            });

            const accessParts = result.accessToken.split('.');
            const refreshParts = result.refreshToken.split('.');
            expect(accessParts).toHaveLength(3);
            expect(refreshParts).toHaveLength(3);
        });

        it('should return accessToken with correct userId and userType in payload', async () => {
            mockEm.findOne.mockResolvedValue(mockUser);
            vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

            const result = await authService.login({
                email: 'atleta@sportlink.com',
                password: 'password123',
            });

            // verificamos que el payload del token contiene los datos correctos
            const decoded = JwtHelper.verifyAccessToken(result.accessToken);
            expect(decoded.userId).toBe(mockUser.id);
            expect(decoded.userType).toBe(mockUser.userType);
        });

        it('should persist the refresh token in the database', async () => {
            mockEm.findOne.mockResolvedValue(mockUser);
            vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

            await authService.login({
                email: 'atleta@sportlink.com',
                password: 'password123',
            });

            // verifica que se intentó guardar el token en la DB
            expect(mockEm.create).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    user: mockUser,
                    isRevoked: false,
                })
            );
            expect(mockEm.persistAndFlush).toHaveBeenCalled();
        });

        it('should throw UnauthorizedError if user does not exist', async () => {
            // el email no existe en la DB
            mockEm.findOne.mockResolvedValue(null);

            const promise = authService.login({
                email: 'noexiste@sportlink.com',
                password: 'password123',
            });

            await expect(promise).rejects.toThrow(UnauthorizedError);
            await expect(promise).rejects.toThrow('Invalid credentials');
        });

        it('should throw UnauthorizedError if password is incorrect', async () => {
            // usuario existe pero la contraseña no coincide
            mockEm.findOne.mockResolvedValue(mockUser);
            vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

            const promise = authService.login({
                email: 'atleta@sportlink.com',
                password: 'wrongpassword',
            });

            await expect(promise).rejects.toThrow(UnauthorizedError);
            await expect(promise).rejects.toThrow('Invalid credentials');
        });

        it('should not reveal whether the email exists when credentials are invalid', async () => {
            // usuario no existe
            mockEm.findOne.mockResolvedValue(null);

            const promise = authService.login({
                email: 'noexiste@sportlink.com',
                password: 'cualquierpassword',
            });

            await expect(promise).rejects.toThrow('Invalid credentials');

            // bcrypt.compare nunca debería llamarse si el usuario no existe
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it('should call bcrypt.compare with the provided password and stored hash', async () => {
            mockEm.findOne.mockResolvedValue(mockUser);
            vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

            await authService
                .login({
                    email: 'atleta@sportlink.com',
                    password: 'password123',
                })
                .catch(() => {});

            // verifica que bcrypt recibió los argumentos correctos
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
        });
    });
});
