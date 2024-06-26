import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './athlete.controler.js';
export const athleteRouter = Router();
athleteRouter.get('/', findAll);
athleteRouter.get('/:id', findOne);
athleteRouter.post('/', add);
athleteRouter.put('/:id', update);
athleteRouter.delete('/:id', remove);
//# sourceMappingURL=athlete.routes.js.map