import { Person } from "../persons/persons.entity.js";
export class Agent extends Person {
    constructor(id, email, contact, type, created_at, is_active, first_name, last_name, club_id) {
        // Call the constructor of the parent class
        super(id, email, contact, type, created_at, is_active, first_name, last_name);
        // Initialize Agent-specific properties
        this.club_id = club_id;
    }
}
//# sourceMappingURL=agent.entity.js.map