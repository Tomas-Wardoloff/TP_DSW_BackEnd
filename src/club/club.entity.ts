import { User } from '../users/users.entity.js';
import { Entity, OneToOne, PrimaryKey, Property, ManyToMany } from "@mikro-orm/core";

@Entity()
export class Club{
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;
  
  @Property()
  address!: string;
  
  @Property()
  opening_date!: Date;

  @OneToOne()
  user!: User;
}