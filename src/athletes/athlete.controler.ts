import { Request, Response } from 'express'
import { Athlete } from './athlete.entity.js'
import { AthleteRepository } from './athlete.repository.js'

const repository = new AthleteRepository()

async function findAll(req: Request, res: Response) {
    res.json({data: await repository.findAll()})
}   


async function findOne(req: Request, res: Response) {
    const athlete = await repository.findOne({id: req.params.id}) 
    // If no athlete is found, return a 404 response
    if (!athlete){
        res.status(404).send({message: "Athlete not found"})
    }
    res.json({data: athlete})
}


async function add(req: Request, res: Response){
    // Destructure the request body to extract the athlete properties
    const {id, email,password, phone_number, user_type, created_at, is_active, last_login, first_name, last_name,date_birth,nationality, sport, position, is_signed} = req.body
    
    // Create a new Athlete object with the provided details
    const new_athlete = new Athlete(
        id, email,password, phone_number, user_type, created_at, is_active, last_login, first_name, last_name,date_birth,nationality,sport, position, is_signed)
    await repository.add(new_athlete)
    res.status(201).send({message: 'Athlete created', data: new_athlete})
}


async function update(req: Request, res: Response){
    const athlete = await repository.update(req.body)
    
    if (!athlete){
        res.status(404).send({message: 'Athlete not found'})
    }else{  
        res.status(200).send({message: 'Athlete updated successfully', data: athlete})
    }
}


async function remove(req: Request, res: Response){
    const athlete = await repository.delete({id: req.params.id})
    
    if (!athlete){
        res.status(404).send({message: 'Athlete not found'})
    }
    else{
        res.status(200).send({message: 'Athlete deleted successfully'})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove}
