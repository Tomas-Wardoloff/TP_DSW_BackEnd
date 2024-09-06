import { User } from '../users/users.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Entity, OneToOne, Property } from "@mikro-orm/core";

@Entity()
export class Club extends BaseEntity {
  @Property({nullable: false})
  name!: string;
  
  @Property({nullable: false})
  address!: string;
  
  @Property({nullable: false})
  opening_date!: Date;

  @OneToOne(() => User, {nullable: false})
  user!: User;
}