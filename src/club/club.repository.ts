import { Club } from "./club.entity";
import { Repository } from "../shared/repository";
import { pool } from '../shared/db/conn.mysql.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class ClubRepository implements Repository<Club>{
    private clubs: Club[] = []

    // Method to return all club objects
    public async findAll(): Promise<Club[] | undefined> {
        const [clubs] = await pool.execute('SELECT * FROM clubs INNER JOIN users ON clubs.id = users.id');
        return clubs as Club[];
    }

    // Method to return a single club object
    public async findOne(item: { id: string; }): Promise<Club | undefined> {
        const id = Number.parseInt(item.id);
        const [clubs] = await pool.query<RowDataPacket[]>('SELECT * FROM clubs INNER JOIN users ON clubs.id = users.id WHERE clubs.id = ?', [id]);

        if (clubs.length === 0) {
            return undefined;
        }
        return clubs[0] as Club;
    }

    // Method to add a new club object to the array
    public async add(clubInput: Club): Promise<Club | undefined> {
        const {email, password, phone_number, user_type, created_at, is_active, last_login, name, address, opening_date} = clubInput;
        
        const [userResult] = await pool.query<ResultSetHeader>('INSERT INTO users SET ?', {email, password, phone_number, user_type: "Club", created_at, is_active, last_login});
        const id = userResult.insertId;


        const [clubResult] = await pool.query<ResultSetHeader>('INSERT INTO clubs SET ?', {id, name, address, opening_date});
        
        return clubInput;
    }

    // Method to update a club object in the array
    public async update(item: Club): Promise<Club | undefined> {
        throw new Error('Method not implemented.');
    }

    // Methode to delete a club object from the array by ID
    public async delete(item: { id: string; }): Promise<Club | undefined> {
        try {
            const clubToDelete = await this.findOne(item);
            const clubId = Number.parseInt(item.id);

            await pool.execute('DELETE FROM clubs WHERE id = ?', [clubId]);
            await pool.execute('DELETE FROM users WHERE id = ?', [clubId]);
            return clubToDelete;
        } catch (error: any){
            throw new Error('Method not implemented.');
        }
    }
}