import { Request, Response } from 'express'
import { Athlete } from './athlete.entity.js'
import { AthleteRepository } from './athlete.repository.js'

const repository = new AthleteRepository()

function findAll(req: Request, res: Response) {
    res.json({data: repository.findAll()})
}   


function findOne(req: Request, res: Response) {
    const athlete = repository.findOne({id: req.params.id}) 
    // If no athlete is found, return a 404 response
    if (!athlete){
        res.status(404).send({message: "Athlete not found"})
    }
    res.json({data: athlete})
}


function add(req: Request, res: Response){
    // Destructure the request body to extract the athlete properties
    const {id, email, contact, type, created_at, is_asctive, name, last_name, sport, position, is_signed} = req.body
    
    // Create a new Athlete object with the provided details
    const new_athlete = new Athlete(
        id, email, contact, type, created_at, is_asctive, name, last_name, sport, position, is_signed
    )
    repository.add(new_athlete)
    res.status(201).send({message: 'Athlete created', data: new_athlete})
}


function update(req: Request, res: Response){
    const athlete = repository.update(req.body)
    
    if (!athlete){
        res.status(404).send({message: 'Athlete not found'})
    }else{  
        res.status(200).send({message: 'Athlete updated successfully', data: athlete})
    }
}


function remove(req: Request, res: Response){
    const athlete = repository.delete({id: req.params.id})
    
    if (!athlete){
        res.status(404).send({message: 'Athlete not found'})
    }
    else{
        res.status(200).send({message: 'Athlete deleted successfully'})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove}
