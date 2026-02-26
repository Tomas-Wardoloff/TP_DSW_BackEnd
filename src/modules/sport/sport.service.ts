import { EntityManager } from "@mikro-orm/mysql";

import { Sport } from "./sport.entity.js";
import { orm } from "../../shared/db/orm.js";
import { Position } from "./position.entity.js";

export class SportService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findAllSports(): Promise<Sport[]> {
        return this.em.find(Sport, {}, {
            populate: ['positions'],
            orderBy: { name: 'ASC' },
        });
    }

    async findOneSport(id: number): Promise<Sport | null> {
        return this.em.findOne(Sport, { id }, {
            populate: ['positions'],
        });
    }

    async findAllPositions(sportId?: number): Promise<Position[]> {
        const where = sportId ? { sport: { id: sportId } } : {};
        return this.em.find(Position, where, {
            populate: ['sport'],
            orderBy: { name: 'ASC' },
        });
    }

    async findOnePosition(id: number): Promise<Position | null> {
        return this.em.findOne(Position, { id }, {
            populate: ['sport'],
        });
    }
}