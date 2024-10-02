import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Post } from './post.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
    try{
        const posts = await em.find(Post, {}, {populate: ['author']})
        res.status(200).json({message: 'found all posts',data: posts})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}   


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const post = await em.findOneOrFail(Post, {id}, {populate: ['author']})
        res.status(200).json({message: 'found post', data: post})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}


async function add(req: Request, res: Response){
    try{
        const { author } = req.body
        const relatedUser = await em.findOneOrFail('User', {id: author})
        if (relatedUser){
            const newPost = em.create(Post, req.body);
            await em.flush()
            res.status(201).json({message: 'Post created', data: newPost})
        }
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

// Users does not have the ability to update posts
async function update(req: Request, res: Response){
    res.status(500).json({message: "Method Not Implemented"})
}


async function remove(req: Request, res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const postToRemove = em.getReference(Post, id)
        await em.removeAndFlush(postToRemove)
        res.status(200).json({message: 'Post removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

// Export the functions to be used in the routes
export {findAll, findOne, add, update, remove}
