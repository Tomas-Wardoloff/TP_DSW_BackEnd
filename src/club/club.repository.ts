import { Club } from "./clubs.entity";
import { Repository } from "../shared/repository";

export class ClubRepository implements Repository<Club>{
    private clubs: Club[] = []

    // Method to return all club objects
    public findAll(): Promise<Club[] | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to return a single club object
    public findOne(item: { id: string; }): Promise<Club | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to add a new club object to the array
    public add(item: Club): Promise<Club | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to update a club object in the array
    public update(item: Club): Promise<Club | undefined> {
        throw new Error('Method not implemented.');
    }

    // Methode to delete a club object from the array by ID
    public delete(item: { id: string; }): Promise<Club | undefined> {
        throw new Error('Method not implemented.');
    }
}