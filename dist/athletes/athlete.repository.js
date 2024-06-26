import { Athlete } from './athlete.entity.js';
export class AthleteRepository {
    constructor() {
        this.athletes = [
            new Athlete('1', 'manuelginobili@gmail.com', '1234567890', 'athlete', new Date(), true, 'Manu', 'Ginobili', 'Basketball', 'Shooting Guard', true)
        ];
    }
    findAll() {
        return this.athletes;
    }
    findOne(item) {
        return this.athletes.find(athlete => athlete.id === item.id);
    }
    add(item) {
        this.athletes.push(item);
        return item;
    }
    update(item) {
        const index = this.athletes.findIndex(athlete => athlete.id === item.id);
        if (index != -1) {
            this.athletes[index] = { ...this.athletes[index], ...item };
        }
        return this.athletes[index];
    }
    delete(item) {
        const index = this.athletes.findIndex(athlete => athlete.id === item.id);
        if (index != -1) {
            const deleted = this.athletes[index];
            this.athletes.splice(index, 1);
            return deleted;
        }
    }
}
//# sourceMappingURL=athlete.repository.js.map