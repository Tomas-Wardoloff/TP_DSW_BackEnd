import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './club.controller.js';

export const clubRouter = Router();

// Define a GET route to fetch all club objects
clubRouter.get('/', findAll);
// Define a GET route to fetch a single club object by ID
clubRouter.get('/:id', findOne);
// Define a POST route to add a new club object
clubRouter.post('/', add);
// Define a PUT route to update an existing club object
clubRouter.put('/:id', update);
// Define a DELETE route to remove an Athlete club by ID
clubRouter.delete('/:id', remove);
