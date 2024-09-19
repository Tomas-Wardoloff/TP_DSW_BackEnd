import { Club } from './club.entity.js';
import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';


const em = orm.em;


async function findAll(req: Request, res: Response) {
    try{
        const clubs = await em.find(Club, {})
        res.status(200).json({message: 'finded all clubs',data: clubs})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }}


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const club = await em.findOneOrFail(Club, {id})
        res.status(200).json({message: 'finded club', data: Club})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function add(req: Request, res: Response){
    try{
        const newClub = em.create(Club, req.body)
        await em.flush()
        res.status(201).json({message: 'Club created', data: newClub})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const clubToUpdate = em.getReference(Club, id)
        em.assign(clubToUpdate, req.body)
        await em.flush()
        res.status(200).json({message: 'Club updated'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const clubToRemove = em.getReference(Club, id)
        await em.removeAndFlush(clubToRemove)
        res.status(200).json({message: 'Club removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove};