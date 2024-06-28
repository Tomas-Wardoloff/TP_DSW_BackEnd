import { User } from '../users/users.entity.js';

export class Club extends User{
  public name: string;
  public opening_date: Date;

  constructor (id: string, email: string, phone_number: string, type: string, created_at: Date, is_active : boolean, last_login: Date, name: string, opening_date: Date){
    super (id, email, phone_number, type, created_at, is_active, last_login);

    this.name = name;
    this.opening_date = opening_date;
  }
}