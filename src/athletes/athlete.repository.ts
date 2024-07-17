import { Athlete } from './athlete.entity.js';
import { Repository } from '../shared/repository.js';
import { pool } from '../shared/db/conn.mysql.js';


export class AthleteRepository implements Repository<Athlete>{
    // Method to return all Athlete objects
    public async findAll(): Promise<Athlete[] | undefined>{
        throw new Error('Method not implemented.');
    }

    // Method to return a single Athlete object
    public async findOne(item: {id: string}): Promise<Athlete | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to add a new Athlete object to the array
    public async add(item: Athlete): Promise<Athlete | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to update an Athlete object in the array
    public async update(item: Athlete): Promise<Athlete | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to delete an Athlete object from the array by ID
    public async delete(item: {id: string}): Promise<Athlete | undefined> {
        throw new Error('Method not implemented.');
    }
}