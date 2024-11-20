import { Request, Response } from 'express';
import { User, UserType } from './user.entity.js';
import { orm } from '../shared/db/orm.js'
import bcrypt from 'bcrypt'; 


const em = orm.em

async function findAll(req: Request, res: Response) {
    try{
        const { userType } = req.query;
        let filters: Partial<User> = {};

        if (userType) filters.userType = userType as UserType;
        const users = await em.find(User, filters)
        res.status(200).json({message: "Users found", data: users})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const user = await em.findOneOrFail(User, {id})
        res.status(200).json({message: 'found user', data: user})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function add(req: Request, res:Response){
    try{
        const { email, password, ...otherFields } = req.body
        const userExists = await em.findOne(User, { email })
        if(userExists){
            res.status(409).json({message: 'User already exists'})
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = em.create(User, { email, password: hashedPassword, ...otherFields})
            await em.flush()
            res.status(201).json({message: 'User created', data: newUser})
        }
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const userToUpdate = await em.getReference(User, id)
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