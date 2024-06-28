import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './agent.controler.js';

export const agentRouter = Router();

// Define a GET route to fetch all Agent objects
agentRouter.get('/', findAll);
// Define a GET route to fetch a single Agent object by ID
agentRouter.get('/:id', findOne);
// Define a POST route to add a new Agent object
agentRouter.post('/', add);
// Define a PUT route to update an existing Agent object
agentRouter.put('/:id', update);
// Define a DELETE route to remove an Agent object by ID
agentRouter.delete('/:id', remove);