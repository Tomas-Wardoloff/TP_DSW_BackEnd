import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './athlete.controler.js';
export const athleteRouter = Router();
// Define a GET route to fetch all Athlete objects
athleteRouter.get('/', findAll);
// Define a GET route to fetch a single Athlete object by ID
athleteRouter.get('/:id', findOne);
// Define a POST route to add a new Athlete object
athleteRouter.post('/', add);
// Define a PUT route to update an existing Athlete object
athleteRouter.put('/:id', update);
// Define a DELETE route to remove an Athlete object by ID
athleteRouter.delete('/:id', remove);
//# sourceMappingURL=athlete.routes.js.map