import { Agent } from './agent.entity.js';
import { Repository } from '../shared/repository.js';


export class AgentRepository implements Repository<Agent>{
    // Private array to store Agent objects
    private agents: Agent[] = [ ];

    // Method to return all Agent objects
    public findAll(): Promise<Agent[] | undefined>{
        throw new Error('Method not implemented.');
    }

    // Method to return a single Agent object
    public findOne(item: {id: string}): Promise<Agent | undefined>{
        throw new Error('Method not implemented.');
    }

    // Method to add a new Agent object to the array
    public add(item: Agent): Promise<Agent | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to update an Agent object in the array
    public update(item: Agent): Promise<Agent | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to delete an Agent object from the array by ID
    public delete(item: {id: string}): Promise<Agent | undefined> {
        throw new Error('Method not implemented.');
    }
}