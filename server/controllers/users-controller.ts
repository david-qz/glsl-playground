import { type Request, type Response, type NextFunction, Router } from 'express';
import * as UsersService from '../services/users-service.js';
import HttpError from '../utils/http-error.js';

const ONE_DAY_IN_MS: number = 3600 * 24 * 1000;

const router = Router();

router.post('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const email: unknown = request.body?.email;
    const password: unknown = request.body?.password;

    if (typeof email !== 'string') throw new HttpError('email must be a string', 400);
    if (typeof password !== 'string') throw new HttpError('password must be a string', 400);

    const user = await UsersService.create(email, password);
    const token = await UsersService.signIn(email, password);

    response.cookie('session', token, { httpOnly: true, maxAge: ONE_DAY_IN_MS });
    response.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;