import { Entity, Opt, PrimaryKey, Property, Enum } from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({unique: true})
  email!: string;

  @Property()
  password!: string;
  
  @Property()
  phone_number!: string;
  
  @Enum(() => UserType)
  user_type!: UserType;
  
  @Property({ onCreate: () => new Date() })
  created_at!: Date;
  
  @Property({default: true})
  is_active!: boolean & Opt;
  
  @Property()
  last_login!: Date;
}

export enum UserType {
  ATHLETE = 'athlete',
  CLUB = 'club',
  AGENT = 'agent'
}