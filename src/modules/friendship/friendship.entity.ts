import { Entity, ManyToOne, Enum, Rel } from "@mikro-orm/core";

import { User } from "../user/user.entity.js";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class Friendship extends BaseEntity {
    // El usuario que envía la solicitud
    @ManyToOne(() => User, { eager: false })
    requester!: Rel<User>;

    // El usuario que recibe la solicitud
    @ManyToOne(() => User, { eager: false })
    addressee!: Rel<User>;

    @Enum(() => FriendshipStatus)
    status!: FriendshipStatus;
}