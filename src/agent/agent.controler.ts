import { Request, Response } from 'express';
import { Agent } from './agent.entity.js';
import { AgentRepository } from './agent.repository.js';

const repository = new AgentRepository();

function findAll(req: Request, res: Response) {
    res.json({data: repository.findAll()});
}


function findOne(req: Request, res: Response) {
    const agent = repository.findOne({id: req.params.id});
    // If no agent is found, return a 404 response
    if (!agent){
        res.status(404).send({message: "Agent not found"});
    }
    res.json({data: agent});
}


function add(req: Request, res:Response){
    // Destructure the request body to extract the agent properties
    const {id, email,password, phone_number, user_type, created_at, is_active, last_login, first_name, last_name, club_id} = req.body;
    
    // Create a new Agent object with the provided details
    const new_agent = new Agent(id, email, password, phone_number, user_type, created_at, is_active, last_login, first_name, last_name, club_id);
    repository.add(new_agent);
    res.status(201).send({message: 'Agent created', data: new_agent});
}


function update(req: Request, res: Response){
    const agent = repository.update(req.body);
    
    if (!agent){
        res.status(404).send({message: 'Agent not found'});
    }else{
        res.status(200).send({message: 'Agent updated successfully', data: agent});
    }
}


function remove(req: Request, res: Response){
    const agent = repository.delete({id: req.params.id});
    
    if (!agent){
        res.status(404).send({message: 'Agent not found'});
    }else{
        res.status(200).send({message: 'Agent deleted successfully'});
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove}