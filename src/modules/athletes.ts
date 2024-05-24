import { Person } from './persons.js';

export class Athlete extends Person{
  constructor (
    id: number,
    email: string,
    contact: string,
    type: string,
    created_at: Date,
    is_asctive : boolean,
    name: string,
    last_name: string,
    private sport: string,
    private position: string,
    private is_signed: boolean
  ){
    super (id, email, contact, type, created_at, is_asctive, name, last_name)
  }
}