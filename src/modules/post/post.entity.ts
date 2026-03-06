import { Entity, Property, ManyToOne, OneToMany, Rel, Collection } from '@mikro-orm/core';

import { Like } from './like.entity.js';
import { User } from '../user/user.entity.js';
import { Comment } from './comment.entity.js';
import { PostMedia } from './post-media.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Post extends BaseEntity {
    @Property({ length: 2000 })
    content!: string;

    @ManyToOne(() => User, { eager: false })
    author!: Rel<User>;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments = new Collection<Comment>(this);

    @OneToMany(() => Like, (like) => like.post)
    likes = new Collection<Like>(this);

    @OneToMany(() => PostMedia, (media) => media.post)
    media = new Collection<PostMedia>(this);
}
