import { Entity, Enum, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { User } from "../user/user.entity.js";


@Entity()
@Unique({ properties: ['senderUser', 'receiverUser'] })
export class FriendRequest extends BaseEntity {
    @ManyToOne(() => User)
    senderUser!: User;
    
    @ManyToOne(() => User)
    receiverUser!: User;
    
    @Enum(() => RequestStatus)
    status!: RequestStatus;
}

export enum RequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}