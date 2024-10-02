import { User } from "../user/user.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Cascade, Entity, ManyToOne, Property } from "@mikro-orm/core";


@Entity()
export class Post extends BaseEntity {
    @ManyToOne(() => User, {nullable: false, cascade: [Cascade.ALL]})
    author!: User;
    
    @Property({length: 50})
    title!: string;
    
    @Property({length: 500})
    content!: string;
}