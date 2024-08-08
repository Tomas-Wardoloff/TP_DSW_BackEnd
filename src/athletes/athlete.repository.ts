import { Athlete } from './athlete.entity.js';
import { Repository } from '../shared/repository.js';
import { pool } from '../shared/db/conn.mysql.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2'


export class AthleteRepository implements Repository<Athlete>{
    // Method to return all Athlete objects
    public async findAll(): Promise<Athlete[] | undefined>{
        const [athletes] = await pool.execute('SELECT * FROM athletes INNER JOIN users ON athletes.id = users.id');
        return athletes as Athlete[];
    }

    // Method to return a single Athlete object
    public async findOne(item: {id: string}): Promise<Athlete | undefined> {
        const id = Number.parseInt(item.id);
        const [athletes] = await pool.query<RowDataPacket[]>('SELECT * FROM athletes INNER JOIN users ON athletes.id = users.id WHERE athletes.id = ?', [id]);

        if (athletes.length === 0) {
            return undefined;
        }
        return athletes[0] as Athlete;
    }

    // Method to add a new Athlete object to the array
    public async add(athleteInput: Athlete): Promise<Athlete | undefined> {
        const {email, password, phone_number, user_type, created_at, is_active, last_login, first_name, last_name, birth_date, nationality, sport, position, is_signed} = athleteInput;
        
        const [userResult] = await pool.query<ResultSetHeader>('INSERT INTO users SET ?', {email, password, phone_number, user_type: "Athlete", created_at, is_active, last_login});
        const id = userResult.insertId;

        const [athleteResult] = await pool.query<ResultSetHeader>('INSERT INTO athletes SET ?', {id, first_name, last_name, birth_date, nationality, sport, position, is_signed});
        
        return athleteInput;
    }

    // Method to update an Athlete object in the array
    public async update(item: Athlete): Promise<Athlete | undefined> {
        throw new Error('Method not implemented.');
    }

    // Method to delete an Athlete object from the array by ID
    public async delete(item: {id: string}): Promise<Athlete | undefined> {
        const athelteToDelte = await this.findOne(item);
        const athleteId = Number.parseInt(item.id);

        await pool.execute('DELETE FROM athletes WHERE id = ?', [athleteId]);
        await pool.execute('DELETE FROM users WHERE id = ?', [athleteId]);
        return athelteToDelte;
    }
}