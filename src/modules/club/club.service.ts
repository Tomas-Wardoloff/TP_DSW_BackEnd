import { EntityManager } from "@mikro-orm/mysql";

import { Club } from "./club.entity.js"
import { orm } from "../../shared/db/orm.js"
import { User } from "../user/user.entity.js";
import { CreateClubDto, UpdateClubDto } from "./club.dto.js";

export class ClubService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findAll(): Promise<Club[]> {
        return this.em.find(Club, {}, {
            populate: ['agents', 'user'],
        });
    }

    async findOne(id: number): Promise<Club | null> {
        return this.em.findOne(Club, { id }, {
            populate: ['agents', 'user'],
        });
    }

    async create(em: EntityManager, user: User, createClubDto: CreateClubDto): Promise<Club> {
        const club = em.create(Club, {
            name: createClubDto.name,
            address: createClubDto.address,
            openingDate: createClubDto.openingDate,
            user,
        });

        em.persist(club);
        return club;
    }

    async update(id: number, dto: UpdateClubDto): Promise<Club> {
        const em = this.em;

        const club = await em.findOne(Club, { id });
        if (!club) {
            throw new Error('Club not found');
        }

        em.assign(club, {
            ...(dto.name && { name: dto.name }),
            ...(dto.address && { address: dto.address }),
            ...(dto.openingDate && { openingDate: dto.openingDate }),
        });

        await em.flush();
        return club;
    }

    async delete(id: number): Promise<void> {
        const em = this.em;

        const club = await em.findOne(Club, { id });
        if (!club) {
            throw new Error('Club not found');
        }

        club.deletedAt = new Date();
        await em.flush();
    }
}