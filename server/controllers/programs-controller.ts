import { type Request, type Response, type NextFunction, Router } from 'express';
import Program, { type ProgramData } from '../models/program-model.js';
import HttpError from '../utils/http-error.js';

const router = Router();

router.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = request.params.id!;
    const program = await Program.getById(id);

    if (!program) throw new HttpError('not found', 404);

    response.json(program);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = request.params.id!;
    const originalProgram = await Program.getById(id);

    if (!originalProgram) throw new HttpError('not found', 404);

    const data: Partial<ProgramData> = request.body;
    const newProgram = await originalProgram.update(id, data);

    response.json(newProgram);
  } catch (error) {
    next(error);
  }
});

export default router;
