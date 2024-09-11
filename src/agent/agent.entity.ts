import { Club } from "../club/club.entity.js";
import { User } from "../users/users.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ManyToOne, Entity, OneToOne, Property, Cascade } from "@mikro-orm/core";

@Entity()
export class Agent extends BaseEntity {
    @Property({nullable: false})
    first_name!: string;
    
    @Property({nullable: false})
    last_name!: string;
    
    @OneToOne(() => User, {nullable: false, cascade: [Cascade.ALL]})
    user!: User;
    
    @ManyToOne(() => Club, { nullable: true, mapToPk: true })
    club_id!: number;
}