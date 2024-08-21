import { Club } from './club.entity.js';
import { Request, Response } from 'express';
import { ClubRepository } from './club.repository.js';

const repository = new ClubRepository();

async function findAll(req: Request, res: Response) {
    res.json({data: await repository.findAll()});
}


async function findOne(req: Request, res: Response) {
    const club = await repository.findOne({id: req.params.id});
    // If no club is found, return a 404 response
    if (!club) {
        res.status(404).send({message: 'Club not found'});
    }
    res.json({data: club});
}


async function add(req: Request, res: Response){
    // Destructure the request body to extract the club properties
    const {id, email, password, phone_number, type, created_at, is_active, last_login, name, address, opening_date} = req.body;
    
    // Create a new Athlete object with the provided details
    const new_club = new Club(
        id, email, password, phone_number, type, created_at, is_active, last_login, name, address, opening_date
    );
    await repository.add(new_club);
    res.status(201).send({message: 'Club created', data: new_club});
}


async function update(req: Request, res: Response){
    const club =  await repository.update(req.params.id, req.body);
    
    if (!club){
        res.status(404).send({message: 'Club not found'});
    }else{
        res.status(200).send({message: 'Club updated successfully', data: club});
    }
}


async function remove(req: Request, res: Response){
    const club = await repository.delete({id: req.params.id});
    
    if (!club){
        res.status(404).send({message: 'Club not found'});
    }else{
        res.status(200).send({message: 'Club deleted successfully'});
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove};