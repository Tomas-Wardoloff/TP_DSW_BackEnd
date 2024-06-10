import { User } from './users.js';
export class Club extends User {
    constructor(id, email, contact, type, created_at, is_active, name, opening_date) {
        super(id, email, contact, type, created_at, is_active);
        this.name = name;
        this.opening_date = opening_date;
    }
}
//# sourceMappingURL=clubs.js.map