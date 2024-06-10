import { Person } from './persons.js';
export class Athlete extends Person {
    constructor(id, email, contact, type, created_at, is_active, first_name, last_name, sport, position, is_signed) {
        super(id, email, contact, type, created_at, is_active, first_name, last_name);
        this.sport = sport;
        this.position = position;
        this.is_signed = is_signed;
    }
}
//# sourceMappingURL=athletes.js.map