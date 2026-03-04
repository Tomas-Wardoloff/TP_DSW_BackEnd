import { Entity, Unique, Rel, ManyToOne } from '@mikro-orm/core';

import { Post } from './post.entity.js';
import { User } from '../user/user.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
@Unique({ properties: ['author', 'post'] })
export class Like extends BaseEntity {
    @ManyToOne(() => User, { eager: false })
    author!: Rel<User>;

    @ManyToOne(() => Post)
    post!: Rel<Post>;
}
