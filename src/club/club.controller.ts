import { Club } from './club.entity.js';
import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { User } from '../user/user.entity.js'


const em = orm.em;


async function findAll(req: Request, res: Response) {
    try{
        const { name } = req.query;
        let filters: Partial<Club> = {
            name: name as string | undefined
        };

        const clubs = await em.find(Club, filters, {populate: ['user']})
        res.status(200).json(clubs)
    }catch (error: any){
        res.status(500).json({message: error.message})
    }}


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const club = await em.findOneOrFail(Club, {id}, {populate: ['user']})
        res.status(200).json(club)
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function add(req: Request, res: Response){
    try{
        const  { userId }  = req.body
        const relatedUser = await em.findOneOrFail(User, {id: userId})
        if (relatedUser){
            /* const existingClub = await em.findOne(Club, {user: relatedUser})
            if (existingClub){
                return res.status(400).json({message: 'This user already has a club profile.'})
            }*/

            req.body.user = relatedUser;
            const newClub = em.create(Club, req.body);
            await em.flush()
            res.status(201).json(newClub)
    }
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const clubToUpdate = em.findOneOrFail(Club, {id})
        em.assign(clubToUpdate, req.body)
        await em.flush()
        res.status(200).json('Club updated')
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const clubToRemove = em.getReference(Club, id)
        await em.removeAndFlush(clubToRemove)
        res.status(200).json('Club removed')
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove};