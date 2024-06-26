import { Person } from '../persons/persons.entity.js';
export class Athlete extends Person {
    constructor(id, email, contact, type, created_at, is_active, first_name, last_name, sport, position, is_signed) {
        super(id, email, contact, type, created_at, is_active, first_name, last_name);
        this.sport = sport;
        this.position = position;
        this.is_signed = is_signed;
    }
}
//# sourceMappingURL=athlete.entity.js.map