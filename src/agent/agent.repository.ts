import { Agent } from './agent.entity.js';
import { Repository } from '../shared/repository.js';
import {pool} from '../shared/db/conn.mysql.js';
import { ResultSetHeader, RowDataPacket} from 'mysql2';


export class AgentRepository implements Repository<Agent>{
    // Method to return all Agent objects
    public async findAll(): Promise<Agent[] | undefined>{
        const [agents] = await pool.execute('SELECT * FROM agents INNER JOIN users ON agents.id = users.id');
        return agents as Agent[];
    }

    // Method to return a single Athlete object
    public async findOne(item: {id: string}): Promise<Agent | undefined> {
        const id = item.id;
        const [agents] = await pool.query<RowDataPacket[]>('SELECT * FROM agents INNER JOIN users ON agents.id = users.id WHERE agents.id = ?', [id]);

        if (agents.length === 0) {
            return undefined;
        }
        return agents[0] as Agent;
    }

    // Method to add a new Agent object to the array
    public async add(agentInput: Agent): Promise<Agent | undefined> {
        try{
            const { email, password, phone_number, user_type, created_at, is_active, last_login, first_name, last_name, club_id} = agentInput

            const [userResult] = await pool.query<ResultSetHeader>('INSERT INTO users SET ?', {email, password, phone_number, user_type: "Agent", created_at, is_active, last_login} )
            const id = userResult.insertId;
            
            const [agentResult] = await pool.query<ResultSetHeader>('INSERT INTO agents SET ?', {id, first_name, last_name, club_id});
            return agentInput
        }
        catch (error: any) {
            throw new Error(error);
        }
    }

    // Method to update an Agent object in the array
    public async update(id: string, agentInput: Agent): Promise<Agent | undefined> {
        const agentId = Number.parseInt(id);
        const {first_name, last_name, club_id} = agentInput;

        const updates = `
            first_name = ?,
            last_name = ?,
            club_id = ?
        `;

        await pool.execute(`UPDATE agents SET ${updates} WHERE id = ?`, [first_name, last_name, club_id, agentId]);    

        return await this.findOne({id: id});

    }

    // Method to delete an Agent object from the array by ID
    public async delete(item: {id: string}): Promise<Agent | undefined> {
        const agentToDelete = await this.findOne(item);
        const agentId = Number.parseInt(item.id);

        await pool.execute('DELETE FROM agents WHERE id = ?', [agentId]);
        await pool.execute('DELTE FROM users WHERE id = ?', [agentId]);
        return agentToDelete;
    }
}