import { type Request, type Response, type NextFunction } from 'express';
import HttpError from '../utils/http-error.js';

export default function errorHandler(error: unknown, request: Request, response: Response, next: NextFunction) {
  if (error instanceof HttpError) {
    response.status(error.status);
    response.send({
      status: error.status,
      message: error.message
    });
  } else {
    console.error(error);
    response.status(500);
    response.send({
      status: 500,
      message: 'an internal server error occurred'
    });
  }
}
