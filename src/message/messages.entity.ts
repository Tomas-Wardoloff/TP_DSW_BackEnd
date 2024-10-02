import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { User } from "../user/user.entity.js";


@Entity()
export class Message extends BaseEntity {
    @OneToOne(() => User)
    senderUser!: User;
    
    @OneToOne(() => User)
    receiverUser!: User;
    
    @Property({length: 500})
    message!: string;
}
