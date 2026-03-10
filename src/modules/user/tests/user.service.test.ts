import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mockeamos el orm para que el test no necesite DB real.
vi.mock('../../../shared/db/orm.js', () => ({
    orm: {
        em: {
            fork: vi.fn(),
        },
    },
}));

// Mockeamos bcrypt para que no haga el hash real
vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashed_password'),
    },
}));

import { UserType } from '../user.entity.js';
import { CreateUserDto } from '../user.dto.js';
import { orm } from '../../../shared/db/orm.js';
import { UserService } from '../user.service.js';
import { ConflictError, BadRequestError } from '../../../shared/erros/http.erros.js';

describe('UserService', () => {
    let userService: UserService;
    let mockEm: any;

    beforeEach(() => {
        mockEm = {
            findOne: vi.fn(),
            create: vi.fn(),
            persist: vi.fn(),
            flush: vi.fn().mockResolvedValue(undefined),
            populate: vi.fn().mockResolvedValue(undefined),
        };

        vi.mocked(orm.em.fork).mockReturnValue(mockEm);

        userService = new UserService();
    });

    describe('create', () => {
        it('should throw ConflictError if email already exists', async () => {
            // el email ya existe en la DB
            const dto: CreateUserDto = {
                email: 'existing@test.com',
                password: 'password123',
                userType: UserType.ATHLETE,
                athleteProfile: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    birthDate: new Date('1995-01-01'),
                    nationality: 'Argentina',
                    sportIds: [1],
                    positionIds: [1],
                },
            };

            // findOne devuelve un usuario existente (simulando que el email ya está tomado)
            mockEm.findOne.mockResolvedValue({ id: 1, email: dto.email });

            await expect(userService.create(dto)).rejects.toThrow(ConflictError);
            await expect(userService.create(dto)).rejects.toThrow('User already exists');
        });

        it('should throw BadRequestError if userType is ATHLETE but athleteProfile is missing', async () => {
            // el email no existe pero falta el perfil
            const dto: CreateUserDto = {
                email: 'new@test.com',
                password: 'password123',
                userType: UserType.ATHLETE,
                // athleteProfile intencionalmente ausente
            };

            mockEm.findOne.mockResolvedValue(null);

            await expect(userService.create(dto)).rejects.toThrow(BadRequestError);
            await expect(userService.create(dto)).rejects.toThrow('Profile data is required');
        });

        it('should throw BadRequestError if userType is CLUB but clubProfile is missing', async () => {
            const dto: CreateUserDto = {
                email: 'club@test.com',
                password: 'password123',
                userType: UserType.CLUB,
                // clubProfile intencionalmente ausente
            };

            mockEm.findOne.mockResolvedValue(null);

            await expect(userService.create(dto)).rejects.toThrow(BadRequestError);
            await expect(userService.create(dto)).rejects.toThrow('Profile data is required');
        });

        it('should throw BadRequestError if userType is AGENT but agentProfile is missing', async () => {
            const dto: CreateUserDto = {
                email: 'agent@test.com',
                password: 'password123',
                userType: UserType.AGENT,
            };

            mockEm.findOne.mockResolvedValue(null);

            await expect(userService.create(dto)).rejects.toThrow(BadRequestError);
            await expect(userService.create(dto)).rejects.toThrow('Profile data is required');
        });
    });
});
