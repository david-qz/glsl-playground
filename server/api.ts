/*******************************************************************************
 * Routes here belong to the API. All routes here assume API_PREFIX. In local
 * development, this is assumed to be /api/v1. See the Webpack configuration.
 ******************************************************************************/
import { Router } from 'express';
import usersController from './controllers/users-controller.js';

const router = Router();

router.use('/users', usersController);

export default router;
