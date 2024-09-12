import { Entity, Enum, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { User } from "../users/users.entity.js";


@Entity()
export class FriendRequest extends BaseEntity {
    @OneToOne(() => User, {nullable: false})
    sender_user!: User;
    
    @OneToOne(() => User, {nullable: false})
    receiver_user!: User;
    
    @Enum(() => RequestStatus)
    status!: RequestStatus;
}

export enum RequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}