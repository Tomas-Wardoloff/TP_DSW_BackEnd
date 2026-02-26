import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Athlete } from '../athlete/athlete.entity.js';

@Entity()
export class Sport extends BaseEntity {
    @Property({ unique: true })
    name!: string;

    @ManyToMany(() => Athlete, (athlete) => athlete.sports)
    athletes = new Collection<Athlete>(this);
}