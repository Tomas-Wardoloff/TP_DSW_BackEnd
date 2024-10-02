import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { User } from "../user/user.entity.js";


@Entity()
export class Message extends BaseEntity {
    @ManyToOne(() => User)
    senderUser!: User;
    
    @ManyToOne(() => User)
    receiverUser!: User;
    
    @Property({length: 500})
    message!: string;

    @Property()
    readDate!: Date;
}
