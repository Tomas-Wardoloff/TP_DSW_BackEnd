import { User } from '../users/users.entity.js';

export class Person extends User{
  public first_name: string;
  public last_name: string;

  constructor (id: string, email: string, contact: string, type: string, created_at: Date, is_active : boolean, first_name: string, last_name: string){
    super (id, email, contact, type, created_at, is_active);
    
    this.first_name = first_name;
    this.last_name = last_name;
  }
}