import { User } from './users.js';

export class Club extends User{
  public name: string;
  public opening_date: Date;

  constructor (id: string, email: string, contact: string, type: string, created_at: Date, is_active : boolean, name: string, opening_date: Date){
    super (id, email, contact, type, created_at, is_active);

    this.name = name;
    this.opening_date = opening_date;
  }
}