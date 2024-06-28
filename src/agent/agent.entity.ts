import { Person } from "../persons/persons.entity.js";

export class Agent extends Person{
    public club_id: string; 

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
        club_id: string 
    ){
        // Call the constructor of the parent class
        super (id, email, phone_number, type, created_at, is_active, last_login, first_name, last_name);
  
        // Initialize Agent-specific properties
        this.club_id = club_id;
    }
}