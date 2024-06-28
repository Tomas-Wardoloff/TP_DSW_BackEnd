import { Club } from "./clubs.entity";
import { Repository } from "../shared/repository";

export class ClubRepository implements Repository<Club>{
    private clubs: Club[] = []

    // Method to return all club objects
    public findAll(): Club[] | undefined {
        return this.clubs;
    }

    // Method to return a single club object
    public findOne(item: { id: string; }): Club | undefined {
        return this.clubs.find(club => club.id === item.id);
    }

    // Method to add a new club object to the array
    public add(item: Club): Club | undefined {
        this.clubs.push(item);
        return item;
    }

    // Method to update a club object in the array
    public update(item: Club): Club | undefined {
        const index = this.clubs.findIndex(club => club.id === item.id);

        if (index != -1) {
            this.clubs[index] = { ...this.clubs[index], ...item };
        }
        return this.clubs[index];
    }

    // Methode to delete a club object from the array by ID
    public delete(item: { id: string; }): Club | undefined {
        const index = this.clubs.findIndex(club => club.id === item.id);

        if (index != -1) {
            const deleted = this.clubs[index];
            this.clubs.splice(index, 1);
            return deleted;
        }
    }
}