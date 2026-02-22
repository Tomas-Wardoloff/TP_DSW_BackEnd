import { Entity, OneToOne, Property, Cascade, Collection, ManyToMany, Rel } from '@mikro-orm/core';

import { User } from '../user/user.entity.js';
import { Sport } from '../sports/sport.entity.js';
import { Position } from '../sports/position.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Athlete extends BaseEntity {
    @Property()
    firstName!: string;

    @Property()
    lastName!: string;

    @Property()
    birthDate!: Date;

    @Property()
    nationality!: string;

    @ManyToMany(() => Sport, (sport) => sport.athletes, { owner: true })
    sports = new Collection<Sport>(this);

    @ManyToMany(() => Position, (position) => position.athletes, { owner: true })
    positions = new Collection<Position>(this);

    @Property({ default: false })
    isSigned!: boolean;

    @OneToOne(() => User, (user) => user.athleteProfile, {
        owner: true,
        unique: true,
        cascade: [Cascade.PERSIST],
    })
    user!: Rel<User>;
}
