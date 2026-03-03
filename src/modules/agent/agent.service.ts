import { EntityManager } from '@mikro-orm/mysql';

import { Agent } from './agent.entity.js';
import { orm } from '../../shared/db/orm.js';
import { User } from '../user/user.entity.js';
import { CreateAgentDto, UpdateAgentDto } from './agent.dto.js';

export class AgentService {
    private get em(): EntityManager {
        return orm.em.fork();
    }

    async findAll(): Promise<Agent[]> {
        return this.em.find(
            Agent,
            {},
            {
                populate: ['clubs', 'user'],
            }
        );
    }

    async findOne(id: number): Promise<Agent | null> {
        return this.em.findOne(
            Agent,
            { id },
            {
                populate: ['clubs', 'user'],
            }
        );
    }

    async create(em: EntityManager, user: User, agentData: CreateAgentDto): Promise<Agent> {
        const agent = em.create(Agent, {
            firstName: agentData.firstName,
            lastName: agentData.lastName,
            user,
        });

        em.persist(agent);
        return agent;
    }

    async update(id: number, updateData: UpdateAgentDto, requestingUserId: number): Promise<Agent> {
        const em = this.em;

        const agent = await em.findOne(Agent, { id });

        if (!agent) throw new Error('Agent not found');

        if (agent.user.id !== requestingUserId) throw new Error('Forbidden');

        em.assign(agent, {
            ...(updateData.firstName && { firstName: updateData.firstName }),
            ...(updateData.lastName && { lastName: updateData.lastName }),
        });

        await em.flush();
        return agent;
    }

    async delete(id: number, requestingUserId: number): Promise<void> {
        const em = this.em;

        const agent = await em.findOne(Agent, { id });
        if (!agent) {
            throw new Error('Agent not found');
        }

        if (agent.user.id !== requestingUserId) throw new Error('Forbidden');

        agent.deletedAt = new Date();
        await em.flush();
    }

    /*async updateClubs(id: number, clubIds: number[]): Promise<Agent> {
        const em = this.em;

        const agent = await em.findOne(Agent, { id }, {
            populate: ['clubs'],
        });
        if (!agent) {
            throw new Error('Agent not found');
        }

        const clubs = await em.find(Club, { id: { $in: clubIds } });
        if (clubs.length !== clubIds.length) {
            throw new Error('One or more club IDs are invalid');
        }

        agent.clubs.set(clubs);
        await em.flush();
        return agent;
    }*/
}
