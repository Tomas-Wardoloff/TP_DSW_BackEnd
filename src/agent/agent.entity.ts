import { Club } from "../club/club.entity.js";
import { User } from "../users/users.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ManyToOne, Entity, OneToOne, Property } from "@mikro-orm/core";

@Entity()
export class Agent extends BaseEntity {
    @Property()
    first_name!: string;
    
    @Property()
    last_name!: string;
    
    @OneToOne(() => User)
    user!: User;
    
    @ManyToOne(() => Club, { nullable: true, mapToPk: true })
    club_id!: number;
}