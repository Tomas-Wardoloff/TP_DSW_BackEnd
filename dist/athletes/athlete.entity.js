import { Person } from '../persons/persons.entity.js';
export class Athlete extends Person {
    constructor(id, email, contact, type, created_at, is_active, first_name, last_name, sport, position, is_signed) {
        // Call the constructor of the parent class
        super(id, email, contact, type, created_at, is_active, first_name, last_name);
        // Initialize Athlete-specific properties
        this.sport = sport;
        this.position = position;
        this.is_signed = is_signed;
    }
}
//# sourceMappingURL=athlete.entity.js.map