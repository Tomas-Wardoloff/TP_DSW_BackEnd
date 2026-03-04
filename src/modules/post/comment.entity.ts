import { Entity, Rel, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';

import { Post } from './post.entity.js';
import { User } from '../user/user.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Comment extends BaseEntity {
    @Property({ length: 1000 })
    content!: string;

    @ManyToOne(() => User, { eager: false })
    author!: Rel<User>;

    @ManyToOne(() => Post)
    post!: Rel<Post>;

    @ManyToOne(() => Comment, { nullable: true, eager: false })
    parentComment?: Rel<Comment>;

    @OneToMany(() => Comment, (comment) => comment.parentComment)
    replies = new Collection<Comment>(this);
}
