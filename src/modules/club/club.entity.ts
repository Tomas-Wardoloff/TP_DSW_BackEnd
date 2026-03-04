import { Entity, OneToOne, Property, Cascade, Collection, ManyToMany, Rel } from '@mikro-orm/core';

import { User } from '../user/user.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Agent } from '../agent/agent.entity.js';

@Entity()
export class Club extends BaseEntity {
    @Property()
    name!: string;

    @Property()
    address!: string;

    @Property()
    openingDate!: Date;

    @ManyToMany(() => Agent, (agent) => agent.clubs)
    agents = new Collection<Agent>(this);

    @OneToOne(() => User, (user) => user.clubProfile, {
        owner: true,
        unique: true,
        cascade: [Cascade.PERSIST],
    })
    user!: Rel<User>;
}
