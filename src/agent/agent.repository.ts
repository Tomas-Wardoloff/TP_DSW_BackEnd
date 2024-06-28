import { Agent } from './agent.entity.js';
import { Repository } from '../shared/repository.js';


export class AgentRepository implements Repository<Agent>{
    // Private array to store Agent objects
    private agents: Agent[] = [ ];

    // Method to return all Agent objects
    public findAll(): Agent[] | undefined{
        return this.agents;
    }

    // Method to return a single Agent object
    public findOne(item: {id: string}): Agent | undefined {
        return this.agents.find(agent => agent.id === item.id);
    }

    // Method to add a new Agent object to the array
    public add(item: Agent): Agent | undefined {
        this.agents.push(item);
        return item;
    }

    // Method to update an Agent object in the array
    public update(item: Agent): Agent | undefined {
        const index = this.agents.findIndex(agent => agent.id === item.id);
        
        if (index != -1) {
            this.agents[index] = {...this.agents[index], ...item};
        }
        return this.agents[index];
    }

    // Method to delete an Agent object from the array by ID
    public delete(item: {id: string}): Agent | undefined {
        const index = this.agents.findIndex(agent => agent.id === item.id);
        
        if (index != -1) {
            const deleted = this.agents[index];
            this.agents.splice(index, 1);
            return deleted;
        }
    }
}