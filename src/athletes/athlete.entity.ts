import { User } from '../users/users.entity.js';

export class Athlete extends User{
  public first_name: string;
  public last_name: string;
  public date_birth: Date;
  public nationality: string;
  public sport: string;
  public position: string;
  public is_signed: boolean;

  constructor (
    id: string,
    email: string,
    password: string,
    phone_number: string,
    user_type: string,
    created_at: Date,
    is_active : boolean,
    last_login: Date,
    first_name: string,
    last_name: string,
    date_birth: Date,
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
    this.date_birth = date_birth;
    this.nationality = nationality;
    this.sport = sport;
    this.position = position;
    this.is_signed = is_signed;
  }
}