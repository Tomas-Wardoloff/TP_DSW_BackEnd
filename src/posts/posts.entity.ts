import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { User } from "../users/users.entity.js";


@Entity()
export class Post extends BaseEntity {
    @OneToOne(() => User, {nullable: false})
    author_user!: User;
    
    @Property({nullable: false, length: 50})
    title!: string;
    
    @Property({nullable: false, length: 500})
    content!: string;
}