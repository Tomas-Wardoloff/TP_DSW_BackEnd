import { Entity, Property, Enum, OneToOne, Rel } from '@mikro-orm/core';

import { Club } from '../club/club.entity.js';
import { Agent } from '../agent/agent.entity.js';
import { Athlete } from '../athlete/athlete.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class User extends BaseEntity {
    @Property({ nullable: false, unique: true })
    email!: string;

    @Property({ length: 256 })
    password!: string;

    @Property({ nullable: true })
    phoneNumber?: string;

    @Enum(() => UserType)
    userType!: UserType;

    @OneToOne(() => Athlete, (athlete) => athlete.user, { nullable: true })
    athleteProfile?: Rel<Athlete>;

    @OneToOne(() => Club, (club) => club.user, { nullable: true })
    clubProfile?: Rel<Club>;

    @OneToOne(() => Agent, (agent) => agent.user, { nullable: true })
    agentProfile?: Rel<Agent>;
}

export enum UserType {
    ATHLETE = 'ATHLETE',
    CLUB = 'CLUB',
    AGENT = 'AGENT',
}
