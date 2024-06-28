export class AgentRepository {
    constructor() {
        // Private array to store Agent objects
        this.agents = [];
    }
    // Method to return all Agent objects
    findAll() {
        return this.agents;
    }
    // Method to return a single Agent object
    findOne(item) {
        return this.agents.find(agent => agent.id === item.id);
    }
    // Method to add a new Agent object to the array
    add(item) {
        this.agents.push(item);
        return item;
    }
    // Method to update an Agent object in the array
    update(item) {
        const index = this.agents.findIndex(agent => agent.id === item.id);
        if (index != -1) {
            this.agents[index] = { ...this.agents[index], ...item };
        }
        return this.agents[index];
    }
    // Method to delete an Agent object from the array by ID
    delete(item) {
        const index = this.agents.findIndex(agent => agent.id === item.id);
        if (index != -1) {
            const deleted = this.agents[index];
            this.agents.splice(index, 1);
            return deleted;
        }
    }
}
//# sourceMappingURL=agent.repository.js.map