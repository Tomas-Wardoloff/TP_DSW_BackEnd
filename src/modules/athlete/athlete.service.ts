import { EntityManager } from '@mikro-orm/mysql';

import { Athlete } from './athlete.entity.js';
import { orm } from '../../shared/db/orm.js';
import { CreateAthleteDto, UpdateAthleteDto } from './athlete.dto.js';
import { User } from '../user/user.entity.js';
import { Sport } from '../sports/sport.entity.js';
import { Position } from '../sports/position.entity.js';

export class AthleteService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findAll(): Promise<Athlete[]> {
        return this.em.find(Athlete, {}, {
            populate: ['sports', 'positions', 'user'],
        });
    }

    async findOne(id: number): Promise<Athlete | null> {
        return this.em.findOne(Athlete, { id }, {
            populate: ['sports', 'positions', 'user'],
        });    
    }

    async create(em: EntityManager, user: User, dto: CreateAthleteDto): Promise<Athlete> {
        const sports = await em.find(Sport, { id: { $in: dto.sportIds } });
        if (sports.length !== dto.sportIds.length) {
            throw new Error('One or more sport IDs are invalid');
        }

        const positions = await em.find(Position, { id: { $in: dto.positionIds } });
        if (positions.length !== dto.positionIds.length) {
            throw new Error('One or more position IDs are invalid');
        }

        const athlete = em.create(Athlete, {
            firstName: dto.firstName,
            lastName: dto.lastName,
            birthDate: dto.birthDate,
            nationality: dto.nationality,
            isSigned: dto.isSigned ?? false,
            user,
        });

        athlete.sports.set(sports);
        athlete.positions.set(positions);

        em.persist(athlete);
        return athlete;
    }

    async update(id: number, updateData: UpdateAthleteDto): Promise<Athlete> {
        const em = this.em;

        const athlete = await em.findOne(Athlete, { id }, {
            populate: ['sports', 'positions'],
        });

        if (!athlete) {
            throw new Error('Athlete not found');
        }

        if (updateData.sportIds) {
            const sports = await em.find(Sport, { id: { $in: updateData.sportIds } });
            if (sports.length !== updateData.sportIds.length) {
                throw new Error('One or more sport IDs are invalid');
            }
            athlete.sports.set(sports);
        }

        if (updateData.positionIds) {
            const positions = await em.find(Position, { id: { $in: updateData.positionIds } });
            if (positions.length !== updateData.positionIds.length) {
                throw new Error('One or more position IDs are invalid');
            }
            athlete.positions.set(positions);
        }

        em.assign(athlete, {
            ...(updateData.firstName && { firstName: updateData.firstName }),
            ...(updateData.lastName && { lastName: updateData.lastName }),
            ...(updateData.birthDate && { birthDate: updateData.birthDate }),
            ...(updateData.nationality && { nationality: updateData.nationality }),
            // isSigned puede ser false explícitamente, así que no usamos
            // el truthy check sino undefined check para no perder el false.
            ...(updateData.isSigned !== undefined && { isSigned: updateData.isSigned }),
        });

        await em.flush();
        return athlete;
    }

    async delete(id: number): Promise<void> {
        const em = this.em;

        const athlete = await em.findOne(Athlete, { id });
        if (!athlete) {
            throw new Error('Athlete not found');
        }

        athlete.deletedAt = new Date();
        await em.flush();
    }
}
