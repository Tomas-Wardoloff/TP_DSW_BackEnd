import { Person } from "../persons/persons.entity.js";

export class Agent extends Person{
    public club_id: string; 

    constructor (
        id: string,
        email: string,
        contact: string,
        type: string,
        created_at: Date,
        is_active : boolean,
        first_name: string,
        last_name: string,
        club_id: string 
    ){
        // Call the constructor of the parent class
        super (id, email, contact, type, created_at, is_active, first_name, last_name);
  
        // Initialize Agent-specific properties
        this.club_id = club_id;
    }
}