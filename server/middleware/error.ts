import {
  type Request,
  type Response,
  type NextFunction,
  type ErrorRequestHandler,
} from 'express'
const handler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 500;

  res.status(status);

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  res.send({
    status,
    message: err.message,
  });
};

export default handler
