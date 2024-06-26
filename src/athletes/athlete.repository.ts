import { Athlete } from './athlete.entity.js';
import { Repository } from '../shared/repository.js';


export class AthleteRepository implements Repository<Athlete>{
    // Private array to store Athlete objects
    private athletes: Athlete[] = [
        new Athlete(
            '1',
            'manuelginobili@gmail.com',
            '1234567890',
            'athlete',
            new Date(),
            true,
            'Manu',
            'Ginobili',
            'Basketball',
            'Shooting Guard',
            true
        )
    ];

    // Method to return all Athlete objects
    public findAll(): Athlete[] {
        return this.athletes;
    }

    // Method to return a single Athlete object
    public findOne(item: {id: string}): Athlete | undefined {
        return this.athletes.find(athlete => athlete.id === item.id);
    }

    // Method to add a new Athlete object to the array
    public add(item: Athlete): Athlete | undefined {
        this.athletes.push(item);
        return item;
    }

    // Method to update an Athlete object in the array
    public update(item: Athlete): Athlete | undefined {
        const index = this.athletes.findIndex(athlete => athlete.id === item.id);
        
        if (index != -1) {
            this.athletes[index] = {...this.athletes[index], ...item};
        }
        return this.athletes[index];
    }

    // Method to delete an Athlete object from the array by ID
    public delete(item: {id: string}): Athlete | undefined {
        const index = this.athletes.findIndex(athlete => athlete.id === item.id);
        
        if (index != -1) {
            const deleted = this.athletes[index];
            this.athletes.splice(index, 1);
            return deleted;
        }
    }
}