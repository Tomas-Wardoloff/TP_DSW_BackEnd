import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './post.controller';

export const postRouter = Router();

// Define a GET route to fetch all Post objects
postRouter.get('/', findAll);
// Define a GET route to fetch a single Post object by ID
postRouter.get('/:id', findOne);
// Define a POST route to add a new Post object
postRouter.post('/', add);
// Define a PUT route to update an existing Post object
postRouter.put('/:id', update);
// Define a DELETE route to remove an Post object by ID
postRouter.delete('/:id', remove);
