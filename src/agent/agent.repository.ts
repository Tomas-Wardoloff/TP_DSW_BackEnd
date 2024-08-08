import { Agent } from './agent.entity.js';
import { Repository } from '../shared/repository.js';
import {pool} from '../shared/db/conn.mysql.js';
import {ResultSetHeader,RowDataPacket} from 'mysql2';


export class AgentRepository implements Repository<Agent>{
    // Private array to store Agent objects
    private agents: Agent[] = [ ];

    // Method to return all Agent objects
    public async findAll(): Promise<Agent[] | undefined>{
        const [athletes] = await pool.execute('SELECT * FROM athletes INNER JOIN users ON agents.id = users.id');
        return athletes as Agent[];
    }

    // Method to return a single Athlete object
    public async findOne(item: {id: string}): Promise<Agent | undefined> {
        const id = item.id;
        const [athletes] = await pool.query<RowDataPacket[]>('SELECT * FROM agents INNER JOIN users ON agents.id = users.id WHERE athletes.id = ?', [id]);

        if (athletes.length === 0) {
            return undefined;
        }
        return athletes[0] as Agent;
    }

    // Method to add a new Agent object to the array
    public async add(agentInput: Agent): Promise<Agent | undefined> {
    const { email, password, phone_number, user_type, created_at, is_active, last_login,first_name,last_name,club_id} = agentInput
    const [userResult] = await pool.query<ResultSetHeader>('insert into users set ?', {email, password, phone_number, user_type, created_at, is_active, last_login} )
    agentInput.id = userResult.insertId

    const [result] = await pool.query<ResultSetHeader>('insert into users set ?', {email, password, phone_number, user_type, created_at, is_active, last_login,first_name,last_name,club_id} )
    return agentInput
    }

    // Method to update an Agent object in the array
    public async update(idInput: string,agentInput: Agent): Promise<Agent | undefined> {
        const agentId = idInput
        const { id, ...agentRow} = agentInput
        await pool.query('update agents set ? where id = ?', [agentRow, agentId])
    
        return await this.findOne({id})
      }

    // Method to delete an Agent object from the array by ID
    public async delete(item: {id: string}): Promise<Agent | undefined> {
        try {
            const agentToDelete = await this.findOne(item);
            const agentId = item.id;
            await pool.execute('delete from agents where id = ?', [agentId]);
            await pool.execute('delete from users where id = ?', [agentId]);
            return agentToDelete;
          } catch (error: any) {
            throw new Error('Method not implemented');
          }
    }
}