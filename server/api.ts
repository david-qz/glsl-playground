/*******************************************************************************
 * Routes here belong to the API. All routes here assume API_PREFIX. In local
 * development, this is assumed to be /api/v1. See the Webpack configuration.
 ******************************************************************************/
import { Router, type Request, type Response, type NextFunction } from 'express';
import usersController from './controllers/users-controller.js';
import HttpError from './utils/http-error.js';

const router = Router();

router.use('/users', usersController);

router.use('*', (request: Request, response: Response, next: NextFunction) => {
  next(new HttpError(`'${request.originalUrl}' not found`, 404));
});

export default router;