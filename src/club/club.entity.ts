import { User } from '../user/user.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Entity, OneToOne, Property, Cascade } from "@mikro-orm/core";

@Entity()
export class Club extends BaseEntity {
  @Property()
  name!: string;
  
  @Property()
  address!: string;
  
  @Property()
  openingDate!: Date;

  @OneToOne(() => User, {nullable: false, cascade: [Cascade.ALL]})
  user!: User;
}