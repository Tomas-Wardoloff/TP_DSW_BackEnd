import { User } from './users.js';

export class Person extends User{
  constructor (
    id: number,
    email: string,
    contact: string,
    type: string,
    created_at: Date,
    is_asctive : boolean,
    private name: string,
    private last_name: string
  ){
    super (id, email, contact, type, created_at, is_asctive)
  }
}