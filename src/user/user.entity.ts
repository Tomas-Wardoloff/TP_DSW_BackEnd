import { Entity, Property, Enum } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class User extends BaseEntity {
  @Property({nullable: false, unique: true})
  email!: string;

  @Property()
  password!: string;
  
  @Property()
  phone_number!: string;
  
  @Enum(() => UserType)
  user_type!: UserType;
  
  @Property({default: true})
  is_active!: boolean;
  
  @Property()
  last_login!: Date;
}

export enum UserType {
  ATHLETE = 'athlete',
  CLUB = 'club',
  AGENT = 'agent'
}