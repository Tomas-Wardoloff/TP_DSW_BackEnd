import { Athlete } from './athlete.entity.js';
export class AthleteRepository {
    constructor() {
        // Private array to store Athlete objects
        this.athletes = [
            new Athlete('1', 'manuelginobili@gmail.com', '1234567890', 'athlete', new Date(), true, 'Manu', 'Ginobili', 'Basketball', 'Shooting Guard', true)
        ];
    }
    // Method to return all Athlete objects
    findAll() {
        return this.athletes;
    }
    // Method to return a single Athlete object
    findOne(item) {
        return this.athletes.find(athlete => athlete.id === item.id);
    }
    // Method to add a new Athlete object to the array
    add(item) {
        this.athletes.push(item);
        return item;
    }
    // Method to update an Athlete object in the array
    update(item) {
        const index = this.athletes.findIndex(athlete => athlete.id === item.id);
        if (index != -1) {
            this.athletes[index] = { ...this.athletes[index], ...item };
        }
        return this.athletes[index];
    }
    // Method to delete an Athlete object from the array by ID
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