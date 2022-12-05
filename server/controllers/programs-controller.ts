import { type Request, type Response, type NextFunction, Router } from 'express';
import Program from '../models/program-model.js';
import authenticate, { AuthenticatedRequest } from '../middleware/authenticate.js';
import HttpError from '../utils/http-error.js';
import { ProgramData } from '../../common/api-types.js';

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

router.get('/', [authenticate], async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  try {
    const user = request.user!;
    const programs = await Program.getByUserId(user.id);

    response.json(programs);
  } catch (error) {
    next(error);
  }
});

router.post('/', [authenticate], async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  try {
    const user = request.user!;

    const data: Partial<ProgramData> = request.body;
    const program = await Program.insert(user.id, data);

    response.json(program);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', [authenticate], async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  try {
    const id = request.params.id!;
    const user = request.user!;

    const originalProgram = await Program.getById(id);
    if (!originalProgram) throw new HttpError('not found', 404);

    if (originalProgram.userId !== user.id) throw new HttpError('forbidden', 403);

    const data: Partial<ProgramData> = request.body;
    const newProgram = await originalProgram.update(id, data);

    response.json(newProgram);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', [authenticate], async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  try {
    const id = request.params.id!;
    const user = request.user!;

    const program = await Program.getById(id);
    if (!program) throw new HttpError('not found', 404);

    if (program.userId !== user.id) throw new HttpError('forbidden', 403);

    await program.delete();

    response.json(program);
  } catch (error) {
    next(error);
  }
});

export default router;
