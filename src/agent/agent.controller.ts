import { Request, Response } from 'express';
import { Agent } from './agent.entity.js';
import { orm } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'
import { Club } from '../club/club.entity.js'


const em = orm.em

async function findAll(req: Request, res: Response) {
    try{
        const agents = await em.find(Agent, {}, {populate: ['user', 'club']})
        res.status(200).json({message: 'found all agents', data: agents})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const agent = await em.findOneOrFail(Agent, {id}, {populate: ['user', 'club']})
        res.status(200).json({message: 'found agent', data: agent})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function add(req: Request, res:Response){
    try{
        const { userId } = req.body
        const { clubId } = req.body
        const relatedUser = await em.findOneOrFail(User, {id: userId})
        const relatedClub = await em.findOneOrFail(Club, clubId)
        const existingAgent = await em.findOne(Agent, {user: relatedUser})
        if (existingAgent){
            res.status(409).json({message: 'Agent already exists'})
        } else {
            req.body.club = relatedClub;
            req.body.user = relatedUser;
            const newAgent = em.create(Agent, req.body)
            await em.flush()
            res.status(201).json({message: 'Agent created', data: newAgent})
        }
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const agentToUpdate = await em.findOneOrFail(Agent, {id})
        em.assign(agentToUpdate, req.body)
        await em.flush()
        res.status(200).json({message: 'Agent updated'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const agentToRemove = em.getReference(Agent, id)
        await em.removeAndFlush(agentToRemove)
        res.status(200).json({message: 'Agent removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove}