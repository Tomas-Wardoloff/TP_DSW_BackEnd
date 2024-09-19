import { Request, Response } from 'express';
import { User } from './users.entity.js';
import { orm } from '../shared/db/orm.js'


const em = orm.em

async function findAll(req: Request, res: Response) {
    try{
        const users = await em.find(User, {})
        res.status(200).json({message: 'finded all users',data: users})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const user = await em.findOneOrFail(User, {id})
        res.status(200).json({message: 'finded user', data: user})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function add(req: Request, res:Response){
    try{
        const newUser = em.create(User, req.body)
        await em.flush()
        res.status(201).json({message: 'User created', data: newUser})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const userToUpdate = em.getReference(User, id)
        em.assign(userToUpdate, req.body)
        await em.flush()
        res.status(200).json({message: 'User updated'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const userToRemove = em.getReference(User, id)
        await em.removeAndFlush(userToRemove)
        res.status(200).json({message: 'User removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove}