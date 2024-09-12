import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { User } from "../users/users.entity.js";


@Entity()
export class Message extends BaseEntity {
    @OneToOne(() => User, {nullable: false})
    sender_user!: User;
    
    @OneToOne(() => User, {nullable: false})
    receiver_user!: User;
    
    @Property({nullable: false, length: 500})
    message!: string;
}
