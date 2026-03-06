import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { User } from '../user/user.entity.js';

@Entity()
export class RefreshToken extends BaseEntity {
    @Property({ unique: true })
    token!: string;

    @ManyToOne(() => User, { eager: false })
    user!: Rel<User>;

    @Property()
    expiresAt!: Date;

    @Property({ default: false })
    isRevoked: boolean = false;
}
