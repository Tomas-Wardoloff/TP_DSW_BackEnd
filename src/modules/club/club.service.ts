import { EntityManager } from "@mikro-orm/mysql";

import { Club } from "./club.entity"
import { orm } from "../../shared/db/orm.js"
import { User } from "../user/user.entity.js";
import { UpdateClubDto } from "./club.dto.js";

export class ClubService {
    private readonly entityManager  = orm.em as EntityManager

    async findAll(): Promise<Club[]> {
        const filters: Partial<Club> = {deletedAt: undefined};
        return this.entityManager.find(Club, filters);
    }

    async findOne(id: number): Promise<Club | null> {
        return this.entityManager.findOne(Club, {id, deletedAt: undefined});
    }

    //create(clubData: CreateClubDto, user: User){}

    async update(id: number, updateData: UpdateClubDto){}

    async delete(id: number): Promise<void> {
        const clubToDelete = await this.entityManager.findOneOrFail(Club, {id});
        clubToDelete.deletedAt = new Date();
        await this.entityManager.flush();
    }
}