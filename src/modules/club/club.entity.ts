import { Entity, OneToOne, Property, Cascade } from '@mikro-orm/core';

import { User } from '../user/user.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Club extends BaseEntity {
    @Property()
    name!: string;

    @Property()
    address!: string;

    @Property()
    openingDate!: Date;

    @OneToOne(() => User, { owner: true, primary: false, unique: true })
    user!: User;
}
