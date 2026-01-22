import { EntityManager } from '@mikro-orm/mysql';

import { Athlete } from './athlete.entity.js';
import { orm } from '../../shared/db/orm.js';
import { CreateAthleteDto, UpdateAthleteDto } from './athlete.dto.js';
import { User } from '../user/user.entity.js';

export class AthleteService {
    private readonly entityManager = orm.em as EntityManager;

    async findAll(): Promise<Athlete[]> {
        const filters: Partial<Athlete> = { deletedAt: undefined };
        return this.entityManager.find(Athlete, filters);
    }

    async findOne(id: number): Promise<Athlete | null> {
        return this.entityManager.findOne(Athlete, { id, deletedAt: null });
    }

    create(athleteData: CreateAthleteDto, user: User): Athlete {
        const newAthlete = this.entityManager.create(Athlete, {
            ...athleteData,
            user,
        });
        return newAthlete;
    }

    async update(id: number, updateData: UpdateAthleteDto): Promise<void> {
        const athleteToUpdate = await this.entityManager.findOneOrFail(Athlete, {
            id,
            deletedAt: null,
        });
        this.entityManager.assign(athleteToUpdate, updateData);
        await this.entityManager.flush();
    }

    async delete(id: number): Promise<void> {
        const athleteToDelete = await this.entityManager.findOneOrFail(Athlete, { id });
        athleteToDelete.deletedAt = new Date();
        await this.entityManager.flush();
    }
}
