import environment from '../environment.js';
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpError from '../utils/http-error.js';
import { type UserToken } from '../../common/api-types';

// It would be nice if we could make the user property required here, but because middleware don't know anything about
// who is before them in the chain, I don't see a way add a truly type-safe custom property into the request object.
// So we'll make this optional, but it should be safe to assert its existence in authenticated routes.
export type AuthenticatedRequest = Request & { user?: UserToken };

export default async function authenticate(request: Request, response: Response, next: NextFunction) {
  try {
    // There's very little type safety going on in here. Maybe there's a better way?
    const cookie = request.cookies[environment.SESSION_COOKIE] || '';

    const jwtPayload: any = jwt.verify(cookie, environment.JWT_SECRET);
    const token: UserToken = { id: jwtPayload.id, email: jwtPayload.email };

    (request as AuthenticatedRequest).user = token;
    next();
  } catch (error) {
    next(new HttpError('unauthorized', 401));
  }
}
