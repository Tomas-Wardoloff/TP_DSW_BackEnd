import { Collection, Entity, ManyToMany, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { Sport } from './sport.entity.js';
import { Athlete } from '../athlete/athlete.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Position extends BaseEntity {
    @Property()
    name!: string;

    @ManyToOne(() => Sport)
    sport!: Rel<Sport>;

    @ManyToMany(() => Athlete, (athlete) => athlete.positions)
    athletes = new Collection<Athlete>(this);
}