import { Person } from '../persons/persons.entity.js';

export class Athlete extends Person{
  public sport: string;
  public position: string;
  public is_signed: boolean;

  constructor (
    id: string,
    email: string,
    phone_number: string,
    type: string,
    created_at: Date,
    is_active : boolean,
    last_login: Date,
    first_name: string,
    last_name: string,
    sport: string,
    position: string,
    is_signed: boolean
  ){
    // Call the constructor of the parent class
    super (id, email, phone_number, type, created_at, is_active, last_login, first_name, last_name);

    // Initialize Athlete-specific properties
    this.sport = sport;
    this.position = position;
    this.is_signed = is_signed;
  }
}