import { Entity, Enum, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { Post } from './post.entity.js';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

export enum MediaType {
    IMAGE = 'IMAGE',
}

@Entity()
export class PostMedia extends BaseEntity {
    // Ruta relativa al archivo
    @Property()
    url!: string;

    @Enum(() => MediaType)
    type!: MediaType;

    @Property()
    originalName!: string;

    // Orden de aparición en el post
    @Property({ default: 0 })
    order: number = 0;

    @ManyToOne(() => Post, { eager: false })
    post!: Rel<Post>;
}
