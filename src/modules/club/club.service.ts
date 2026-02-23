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

    async update(id: number, updateData: UpdateClubDto, requestingUserId: number): Promise<Club> {
        const em = this.em;

        const club = await em.findOne(Club, { id });
        
        if (!club) throw new Error('Club not found');

        if (club.user.id !== requestingUserId) throw new Error('Forbidden');

        em.assign(club, {
            ...(updateData.name && { name: updateData.name }),
            ...(updateData.address && { address: updateData.address }),
            ...(updateData.openingDate && { openingDate: updateData.openingDate }),
        });

        await em.flush();
        return club;
    }

    async delete(id: number, requestingUserId: number): Promise<void> {
        const em = this.em;

        const club = await em.findOne(Club, { id });
        
        if (!club) throw new Error('Club not found');

        if (club.user.id !== requestingUserId) throw new Error('Forbidden');

        club.deletedAt = new Date();
        await em.flush();
    }
}