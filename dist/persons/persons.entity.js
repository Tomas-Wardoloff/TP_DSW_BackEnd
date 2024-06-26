import { User } from '../users/users.entity.js';
export class Person extends User {
    constructor(id, email, contact, type, created_at, is_active, first_name, last_name) {
        super(id, email, contact, type, created_at, is_active);
        this.first_name = first_name;
        this.last_name = last_name;
    }
}
//# sourceMappingURL=persons.entity.js.map