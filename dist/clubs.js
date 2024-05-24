import { User } from './users.js';
export class Person extends User {
    constructor(id, email, contact, type, created_at, is_asctive, name, opening_date) {
        super(id, email, contact, type, created_at, is_asctive);
        this.name = name;
        this.opening_date = opening_date;
    }
}
//# sourceMappingURL=clubs.js.map