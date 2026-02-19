import { Filter, PrimaryKey, Property } from '@mikro-orm/core';

@Filter({ name: 'notDeleted', cond: { deletedAt: null }, default: true })
export abstract class BaseEntity {
    @PrimaryKey()
    id!: number;

    @Property({ onCreate: () => new Date() })
    createdAt? = new Date();

    @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
    updatedAt? = new Date();

    @Property({ nullable: true })
    deletedAt?: Date;
}
