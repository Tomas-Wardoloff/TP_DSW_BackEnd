import { Entity, OneToOne, Property } from '@mikro-orm/core';

import { User } from '../user/user.entity.js';
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

    @Property()
    sport!: string;

    @Property()
    position!: string;

    @Property({ default: false })
    isSigned!: boolean;

    @OneToOne(() => User, { owner: true, primary: false, unique: true })
    user!: User;
}
