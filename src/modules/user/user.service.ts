import bcrypt from 'bcrypt';
import { EntityManager } from '@mikro-orm/mysql';

import { orm } from '../../shared/db/orm.js';
import { User, UserType } from './user.entity.js';
import { CreateUserDto, UpdateUserDto } from './user.dto.js';
import { AthleteService } from '../athlete/athlete.service.js';
import { CreateAthleteDto } from '../athlete/athlete.dto.js';

export class UserService {
    private readonly entityManager = orm.em as EntityManager;
    private readonly athleteService = new AthleteService();

    async findAll(userType?: UserType): Promise<User[]> {
        const filters: Partial<User> = { deletedAt: undefined };
        return this.entityManager.find(User, filters);
    }

    async findOne(id: number): Promise<User | null> {
        return this.entityManager.findOne(User, { id, deletedAt: null });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.entityManager.findOne(User, { email });
    }

    async create(userData: CreateUserDto) {
        const userExists = await this.findByEmail(userData.email);
        if (userExists) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        const newUser = this.entityManager.create(User, userData);

        this.entityManager.persist(newUser);

        if (userData.userType == UserType.ATHLETE && userData.athleteProfile) {
            const newAthlete = this.athleteService.create(
                userData.athleteProfile as CreateAthleteDto,
                newUser
            );
            this.entityManager.persist(newAthlete);
        }

        await this.entityManager.flush();
        return {
            ...newUser,
            profile: userData.athleteProfile,
        };
    }

    async update(id: number, updateData: UpdateUserDto): Promise<void> {
        const userToUpdate = await this.entityManager.findOneOrFail(User, { id, deletedAt: null });

        if (updateData.password) {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }

        if (updateData.email) {
            const isEmailTaken = await this.findByEmail(updateData.email);
            if (isEmailTaken) {
                throw new Error('Email is already taken');
            }
        }

        this.entityManager.assign(userToUpdate, updateData);
        await this.entityManager.persistAndFlush(userToUpdate);
    }

    async delete(id: number): Promise<void> {
        const userToDelete = await this.entityManager.findOneOrFail(User, { id });
        userToDelete.deletedAt = new Date();
        await this.entityManager.flush();
    }
}
