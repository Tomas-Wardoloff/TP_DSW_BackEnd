import { User } from './users.js';
export class Person extends User {
    constructor(id, email, contact, type, created_at, is_asctive, name, last_name) {
        super(id, email, contact, type, created_at, is_asctive);
        this.name = name;
        this.last_name = last_name;
    }
}
//# sourceMappingURL=persons.js.map