import bcrypt from 'bcrypt';
import { EntityManager } from '@mikro-orm/mysql';

import { orm } from '../../shared/db/orm.js';
import { User, UserType } from './user.entity.js';
import { CreateUserDto, UpdateUserDto } from './user.dto.js';
import { AthleteService } from '../athlete/athlete.service.js';
import { AgentService } from '../agent/agent.service.js';
import { ClubService } from '../club/club.service.js';
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from '../../shared/erros/http.erros.js';

export class UserService {
    private readonly clubService = new ClubService();
    private readonly athleteService = new AthleteService();
    private readonly agentService = new AgentService();

    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findAll(userType?: UserType): Promise<User[]> {
        const where = userType && Object.values(UserType).includes(userType) ? { userType } : {};

        return this.em.find(User, where, {
            populate: ['athleteProfile', 'clubProfile', 'agentProfile'],
        });
    }

    async findOne(id: number): Promise<User | null> {
        return this.em.findOne(
            User,
            { id },
            {
                populate: [
                    'athleteProfile',
                    'clubProfile',
                    'agentProfile',
                    'athleteProfile.sports',
                    'athleteProfile.positions',
                ],
            }
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.em.findOne(User, { email });
    }

    async create(userData: CreateUserDto) {
        const em = this.em;

        this.validateProfilePresence(userData);

        const userExists = await this.findByEmail(userData.email);
        if (userExists) throw new ConflictError('User already exists');

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = em.create(User, {
            email: userData.email,
            password: hashedPassword,
            phoneNumber: userData.phoneNumber,
            userType: userData.userType,
        });

        if (userData.userType === UserType.ATHLETE) {
            await this.athleteService.create(em, newUser, userData.athleteProfile!);
        } else if (userData.userType === UserType.CLUB) {
            await this.clubService.create(em, newUser, userData.clubProfile!);
        } else if (userData.userType === UserType.AGENT) {
            await this.agentService.create(em, newUser, userData.agentProfile!);
        }

        await em.flush();

        await em.populate(newUser, ['athleteProfile', 'clubProfile', 'agentProfile']);

        return newUser;
    }

    async update(id: number, updateData: UpdateUserDto, requestingUserId: number): Promise<User> {
        const em = this.em;

        const user = await em.findOne(User, { id });

        if (!user) throw new NotFoundError('User not found');

        if (user.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        if (updateData.email && updateData.email !== user.email) {
            const isEmailTaken = await this.findByEmail(updateData.email);
            if (isEmailTaken) throw new ConflictError('Email is already taken');
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        em.assign(user, updateData);
        await em.flush();

        return user;
    }

    async delete(id: number, requestingUserId: number): Promise<void> {
        const em = this.em;

        const user = await em.findOne(
            User,
            { id },
            { populate: ['athleteProfile', 'clubProfile', 'agentProfile'] }
        );

        if (!user) throw new NotFoundError('User not found');

        if (user.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        const now = new Date();

        if (user.athleteProfile) {
            user.athleteProfile.deletedAt = now;
        } else if (user.clubProfile) {
            user.clubProfile.deletedAt = now;
        } else if (user.agentProfile) {
            user.agentProfile.deletedAt = now;
        }

        user.deletedAt = now;
        await em.flush();
    }

    private validateProfilePresence(userData: CreateUserDto): void {
        const profileMap = {
            [UserType.ATHLETE]: userData.athleteProfile,
            [UserType.CLUB]: userData.clubProfile,
            [UserType.AGENT]: userData.agentProfile,
        };

        if (!profileMap[userData.userType]) {
            throw new BadRequestError('Profile data is required');
        }
    }
}
