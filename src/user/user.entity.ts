import { Entity, Property, Enum } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class User extends BaseEntity {
  @Property({nullable: false, unique: true})
  email!: string;

  @Property({length: 256})
  password!: string;
  
  @Property({nullable: true})
  phoneNumber!: string;
  
  @Enum(() => UserType)
  userType!: UserType;
  
  @Property({default: true})
  isActive!: boolean;
  
  @Property({nullable: true})
  lastLogin!: Date;
}

export enum UserType {
  ATHLETE = 'ATHLETE',
  CLUB = 'CLUB',
  AGENT = 'AGENT'
}