import { Club } from "../club/club.entity.js";
import { User } from "../user/user.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entity, OneToOne, Property, Cascade } from "@mikro-orm/core";

@Entity()
export class Agent extends BaseEntity {
    @Property()
    firstName!: string;
    
    @Property()
    lastName!: string;
    
    @OneToOne(() => User, {nullable: false, cascade: [Cascade.ALL]})
    user!: User;
    
    @OneToOne(() => Club, { nullable: true, cascade: [Cascade.ALL]})
    club!: Club;
}