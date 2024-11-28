import { Router } from 'express';
import { findAll, findOne, add, update, remove, login } from './user.controller.js';

export const userRouter = Router();

// Define a GET route to fetch all Users objects
userRouter.get('/', findAll);
// Define a GET route to fetch a single Users object by ID
userRouter.get('/:id', findOne);
// Define a POST route to add a new Users object
userRouter.post('/', add);
// Define a PUT route to update an existing Users object
userRouter.put('/:id', update);
// Define a DELETE route to remove an Users object by ID
userRouter.delete('/:id', remove);
// Define a POST route to login a user
userRouter.post('/login', login);