import { Request, Response } from 'express'
import { Athlete } from './athlete.entity.js'
import { orm } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'



const em = orm.em

async function findAll(req: Request, res: Response) {
    try{
        const { sport, position, isSigned, nationality} = req.query;
        let filters: Partial<Athlete> = {
            sport: sport as string | undefined,
            position: position as string | undefined,
            isSigned: isSigned as boolean | undefined,
            nationality: nationality as string | undefined
        };

        const athletes = await em.find(Athlete, filters, {populate: ['user']})
        res.status(200).json(athletes)
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}   


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const athlete = await em.findOneOrFail(Athlete, {id}, {populate: ['user']})
        res.status(200).json(athlete)
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function add(req: Request, res: Response){
    try{
        await em.flush()
        const  id  = req.body.userId
        const relatedUser = await em.findOneOrFail(User, id)
        if (relatedUser){
            req.body.user = relatedUser;
            const newAthlete = em.create(Athlete, req.body);
            await em.flush()
            res.status(201).json(newAthlete)
        }
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const athleteToUpdate = await em.findOneOrFail(Athlete, {id})
        em.assign(athleteToUpdate, req.body)
        await em.flush()
        const message = 'Athlete updated'

        res.status(200).json(message)
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const athleteToRemove = em.getReference(Athlete, id)
        await em.removeAndFlush(athleteToRemove)
        const message = 'Athlete removed'

        res.status(200).json(message)
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove}
