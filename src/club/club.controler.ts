import { Club } from './clubs.entity.js';
import { Request, Response } from 'express';
import { ClubRepository } from './club.repository.js';

const repository = new ClubRepository();

function findAll(req: Request, res: Response) {
    res.json({data: repository.findAll()});
}


function findOne(req: Request, res: Response) {
    const club = repository.findOne({id: req.params.id});
    // If no club is found, return a 404 response
    if (!club) {
        res.status(404).send({message: 'Club not found'});
    }
    res.json({data: club});
}


function add(req: Request, res: Response){
    // Destructure the request body to extract the club properties
    const {id, email, phone_number, type, created_at, is_active, last_login, name, opening_date} = req.body;
    
    // Create a new Athlete object with the provided details
    const new_club = new Club(
        id, email, phone_number, type, created_at, is_active, last_login, name, opening_date
    );
    repository.add(new_club);
    res.status(201).send({message: 'Club created', data: new_club});
}


function update(req: Request, res: Response){
    const club = repository.update(req.body);
    
    if (!club){
        res.status(404).send({message: 'Club not found'});
    }else{
        res.status(200).send({message: 'Club updated successfully', data: club});
    }
}


function remove(req: Request, res: Response){
    const club = repository.delete({id: req.params.id});
    
    if (!club){
        res.status(404).send({message: 'Club not found'});
    }else{
        res.status(200).send({message: 'Club deleted successfully'});
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove};