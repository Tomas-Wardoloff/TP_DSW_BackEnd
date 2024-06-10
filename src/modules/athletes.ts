import { Person } from './persons.js';

export class Athlete extends Person{
  public sport: string;
  public position: string;
  public is_signed: boolean;

  constructor (
    id: string,
    email: string,
    contact: string,
    type: string,
    created_at: Date,
    is_active : boolean,
    first_name: string,
    last_name: string,
    sport: string,
    position: string,
    is_signed: boolean
  ){
    super (id, email, contact, type, created_at, is_active, first_name, last_name);

    this.sport = sport;
    this.position = position;
    this.is_signed = is_signed;
  }
}