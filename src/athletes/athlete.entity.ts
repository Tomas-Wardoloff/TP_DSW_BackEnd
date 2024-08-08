import { User } from '../users/users.entity.js';

export class Athlete extends User{
  public first_name: string;
  public last_name: string;
  public birth_date: Date;
  public nationality: string;
  public sport: string;
  public position: string;
  public is_signed: boolean;

  constructor (
    id: number,
    email: string,
    password: string,
    phone_number: string,
    user_type: string,
    created_at: Date,
    is_active : boolean,
    last_login: Date,
    first_name: string,
    last_name: string,
    birth_date: Date,
    nationality: string,
    sport: string,
    position: string,
    is_signed: boolean
  ){
    // Call the constructor of the parent class
    super (id, email,password, phone_number, user_type, created_at, is_active, last_login);

    // Initialize Athlete-specific properties
    this.first_name = first_name;
    this.last_name = last_name;
    this.birth_date = birth_date;
    this.nationality = nationality;
    this.sport = sport;
    this.position = position;
    this.is_signed = is_signed;
  }
}