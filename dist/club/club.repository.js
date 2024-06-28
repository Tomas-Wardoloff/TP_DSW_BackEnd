export class ClubRepository {
    constructor() {
        this.clubs = [];
    }
    // Method to return all club objects
    findAll() {
        return this.clubs;
    }
    // Method to return a single club object
    findOne(item) {
        return this.clubs.find(club => club.id === item.id);
    }
    // Method to add a new club object to the array
    add(item) {
        this.clubs.push(item);
        return item;
    }
    // Method to update a club object in the array
    update(item) {
        const index = this.clubs.findIndex(club => club.id === item.id);
        if (index != -1) {
            this.clubs[index] = { ...this.clubs[index], ...item };
        }
        return this.clubs[index];
    }
    // Methode to delete a club object from the array by ID
    delete(item) {
        const index = this.clubs.findIndex(club => club.id === item.id);
        if (index != -1) {
            const deleted = this.clubs[index];
            this.clubs.splice(index, 1);
            return deleted;
        }
    }
}
//# sourceMappingURL=club.repository.js.map