import { Entity, OneToOne, Property, Cascade, Collection, ManyToMany } from '@mikro-orm/core';

import { Club } from '../club/club.entity.js';
import { User } from '../user/user.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Agent extends BaseEntity {
    @Property()
    firstName!: string;

    @Property()
    lastName!: string;
    
    @ManyToMany(() => Club, (club) => club.agents, { owner: true })
    clubs = new Collection<Club>(this);

    @OneToOne(() => User, (user) => user.agentProfile, {
        owner: true,
        unique: true,
        cascade: [Cascade.PERSIST],
    })
    user!: User;
}
