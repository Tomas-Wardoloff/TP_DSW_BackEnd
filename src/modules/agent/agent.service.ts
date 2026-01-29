import { EntityManager } from "@mikro-orm/mysql"

import { Agent } from "./agent.entity.js"
import { orm } from "../../shared/db/orm.js"
import { User } from "../user/user.entity.js";
import { Club } from "../club/club.entity.js";
import { CreateAgentDto, UpdateAgentDto } from "./agent.dto.js";

export class AgentService {
    private readonly entityManager  = orm.em as EntityManager

    async findAll(): Promise<Agent[]> {
        const filters: Partial<Agent> = {deletedAt: undefined};
        return this.entityManager.find(Agent, filters);
    }

    async findOne(id: number): Promise<Agent | null> {
        return this.entityManager.findOne(Agent, {id, deletedAt: undefined});
    }

    create(agentData: CreateAgentDto, user: User, club: Club): Agent {
        const newAgent = this.entityManager.create(Agent, {
            ...agentData, 
            user, 
            club,
        });
        return newAgent
    }

    async update(id: number, updateData: UpdateAgentDto): Promise<void> {
        const agentToUpdate = await this.entityManager.findOneOrFail(Agent, {
            id,
            deletedAt: undefined,
        });
        this.entityManager.assign(agentToUpdate, updateData);
        await this.entityManager.flush();
    }

    async delete(id: number): Promise<void> {
        const agentToDelete = await this.entityManager.findOneOrFail(Agent, {id});
        agentToDelete.deletedAt = new Date();
        await this.entityManager.flush();
    }
}