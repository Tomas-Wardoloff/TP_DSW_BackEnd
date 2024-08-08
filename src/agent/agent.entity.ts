import { User } from "../users/users.entity.js";

export class Agent extends User{
    public first_name: string;
    public last_name: string;
    public club_id: string; 

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
        club_id: string 
    ){
        // Call the constructor of the parent class
        super (id, email, password, phone_number, user_type, created_at, is_active, last_login);
  
        // Initialize Agent-specific properties
        this.first_name = first_name;
        this.last_name = last_name;
        this.club_id = club_id;
    }
}