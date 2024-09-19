import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './user.controller.js';

export const userRouter = Router();

// Define a GET route to fetch all Agent objects
userRouter.get('/', findAll);
// Define a GET route to fetch a single Agent object by ID
userRouter.get('/:id', findOne);
// Define a POST route to add a new Agent object
userRouter.post('/', add);
// Define a PUT route to update an existing Agent object
userRouter.put('/:id', update);
// Define a DELETE route to remove an Agent object by ID
userRouter.delete('/:id', remove);