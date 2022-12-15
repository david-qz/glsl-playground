import environment from '../environment.js';
import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpError from '../utils/http-error.js';
import { type UserToken } from '../../common/api-types';

export default async function authenticate(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const cookie: string = request.cookies[environment.SESSION_COOKIE] || '';

    const jwtPayload: any = jwt.verify(cookie, environment.JWT_SECRET);
    const token: UserToken = { id: jwtPayload.id, email: jwtPayload.email };

    request.user = token;
    next();
  } catch (error) {
    next(new HttpError('unauthorized', 401));
  }
}
