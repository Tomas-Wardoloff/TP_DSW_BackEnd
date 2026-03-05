import { EntityManager } from '@mikro-orm/mysql';

import { Athlete } from './athlete.entity.js';
import { orm } from '../../shared/db/orm.js';
import { User } from '../user/user.entity.js';
import { Sport } from '../sport/sport.entity.js';
import { Position } from '../sport/position.entity.js';
import { CreateAthleteDto, FilterAthleteDto, UpdateAthleteDto } from './athlete.dto.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../shared/erros/http.erros.js';

export class AthleteService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findAll(filters: FilterAthleteDto): Promise<Athlete[]> {
        const where: Record<string, any> = {};

        if (filters.sportId) where.sports = { id: filters.sportId };

        if (filters.positionId) where.positions = { id: filters.positionId };

        if (filters.nationality) where.nationality = { $ilike: `%${filters.nationality}%` };

        if (filters.isSigned !== undefined) where.isSigned = filters.isSigned;

        return this.em.find(Athlete, where, {
            populate: ['sports', 'positions', 'user'],
            orderBy: { lastName: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Athlete | null> {
        return this.em.findOne(
            Athlete,
            { id },
            {
                populate: ['sports', 'positions', 'user'],
            }
        );
    }

    async create(em: EntityManager, user: User, athleteData: CreateAthleteDto): Promise<Athlete> {
        const sports = await em.find(Sport, { id: { $in: athleteData.sportIds } });
        if (sports.length !== athleteData.sportIds.length) {
            throw new BadRequestError('One or more sport IDs are invalid');
        }

        const positions = await em.find(Position, { id: { $in: athleteData.positionIds } });
        if (positions.length !== athleteData.positionIds.length) {
            throw new BadRequestError('One or more position IDs are invalid');
        }

        const athlete = em.create(Athlete, {
            firstName: athleteData.firstName,
            lastName: athleteData.lastName,
            birthDate: athleteData.birthDate,
            nationality: athleteData.nationality,
            isSigned: athleteData.isSigned ?? false,
            user,
        });

        athlete.sports.set(sports);
        athlete.positions.set(positions);

        em.persist(athlete);
        return athlete;
    }

    async update(
        id: number,
        updateData: UpdateAthleteDto,
        requestingUserId: number
    ): Promise<Athlete> {
        const em = this.em;

        const athlete = await em.findOne(
            Athlete,
            { id },
            {
                populate: ['sports', 'positions'],
            }
        );

        if (!athlete) throw new NotFoundError('Athlete not found');

        if (athlete.user.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        if (updateData.sportIds) {
            const sports = await em.find(Sport, { id: { $in: updateData.sportIds } });
            if (sports.length !== updateData.sportIds.length) {
                throw new BadRequestError('One or more sport IDs are invalid');
            }
            athlete.sports.set(sports);
        }

        if (updateData.positionIds) {
            const positions = await em.find(Position, { id: { $in: updateData.positionIds } });
            if (positions.length !== updateData.positionIds.length) {
                throw new BadRequestError('One or more position IDs are invalid');
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

    async delete(id: number, requestingUserId: number): Promise<void> {
        const em = this.em;

        const athlete = await em.findOne(Athlete, { id });
        if (!athlete) throw new NotFoundError('Athlete not found');

        if (athlete.user.id !== requestingUserId) throw new ForbiddenError('Forbidden');

        athlete.deletedAt = new Date();
        await em.flush();
    }
}
