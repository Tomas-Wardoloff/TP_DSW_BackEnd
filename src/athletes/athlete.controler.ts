import { Request, Response } from 'express'
import { Athlete } from './athlete.entity.js'
import { orm } from '../shared/db/orm.js'


const em = orm.em

async function findAll(req: Request, res: Response) {
    try{
        const athletes = await em.find(Athlete, {})
        res.status(200).json({message: 'finded all athletes',data: athletes})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}   


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const athlete = await em.findOneOrFail(Athlete, {id})
        res.status(200).json({message: 'finded athlete', data: athlete})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function add(req: Request, res: Response){
    try{
        const newAthlete = em.create(Athlete, req.body)
        await em.flush()
        res.status(201).json({message: 'Athlete created', data: newAthlete})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const athleteToUpdate = em.getReference(Athlete, id)
        em.assign(athleteToUpdate, req.body)
        await em.flush()
        res.status(200).json({message: 'Athlete updated'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const athlete = em.getReference(Athlete, id)
        await em.removeAndFlush(athlete)
        res.status(200).json({message: 'Athlete removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove}
