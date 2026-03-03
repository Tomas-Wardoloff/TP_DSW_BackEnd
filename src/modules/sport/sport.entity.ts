import { Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';

import { Position } from './position.entity.js';
import { Athlete } from '../athlete/athlete.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Sport extends BaseEntity {
    @Property({ unique: true })
    name!: string;

    @ManyToMany(() => Athlete, (athlete) => athlete.sports)
    athletes = new Collection<Athlete>(this);

    // Relación inversa hacia Position para poder popular
    // las posiciones desde el lado del deporte
    @OneToMany(() => Position, (position) => position.sport)
    positions = new Collection<Position>(this);
}
