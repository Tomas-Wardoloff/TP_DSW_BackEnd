import { User } from "../users/users.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import {Entity, OneToOne, Property } from "@mikro-orm/core";

@Entity()
export class Athlete extends BaseEntity {
  @Property({nullable: false})
  first_name!: string;
  
  @Property({nullable: false})
  last_name!: string;
  
  @Property({nullable: false})
  birth_date!: Date;
  
  @Property({nullable: false})
  nationality!: string;
  
  @Property({nullable: false})
  sport!: string;
  
  @Property({nullable: false})
  position!: string;
  
  @Property({default: false, nullable: false})
  is_signed!: boolean;

  @OneToOne(() => User, {nullable: false})
  user!: User;
}