import { User } from "../users/users.entity";
import { Opt, Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Athlete{
  @PrimaryKey()
  id!: number;

  @Property()
  first_name!: string;
  
  @Property()
  last_name!: string;
  
  @Property()
  birth_date!: Date;
  
  @Property()
  nationality!: string;
  
  @Property()
  sport!: string;
  
  @Property()
  position!: string;
  
  @Property({default: false})
  is_signed!: boolean & Opt;

  @OneToOne()
  user!: User;
}