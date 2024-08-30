import { Club } from "../club/club.entity.js";
import { User } from "../users/users.entity.js";
import { ManyToOne, Entity, OneToOne, PrimaryKey, Property, ManyToMany } from "@mikro-orm/core";

@Entity()
export class Agent{
    @PrimaryKey()
    id!: number;

    @Property()
    first_name!: string;
    
    @Property()
    last_name!: string;
    
    @OneToOne()
    user!: User;
    
    @ManyToOne(() => Club, { nullable: true, mapToPk: true })
    club_id!: number;
}