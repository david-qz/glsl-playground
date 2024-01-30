import { type NextFunction, type Request, type Response, Router } from "express";
import jwt from "jsonwebtoken";
import type { UserToken } from "../../common/api-types.js";
import environment from "../environment.js";
import { UsersService } from "../services/users-service.js";
import HttpError from "../utils/http-error.js";

const ONE_DAY_IN_MS: number = 3600 * 24 * 1000;

const router = Router();

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const email: unknown = request.body?.email;
    const password: unknown = request.body?.password;

    if (typeof email !== "string") throw new HttpError("email must be a string", 400);
    if (typeof password !== "string") throw new HttpError("password must be a string", 400);

    const user = await UsersService.create(email, password);
    const [, token] = await UsersService.signIn(email, password);

    response.cookie(environment.SESSION_COOKIE, token, { httpOnly: true, maxAge: ONE_DAY_IN_MS });
    response.json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const cookie: string = request.cookies[environment.SESSION_COOKIE] || "";

    const jwtPayload = jwt.verify(cookie, environment.JWT_SECRET) as UserToken;
    const token: UserToken = { id: jwtPayload.id, email: jwtPayload.email };

    response.json(token);
  } catch (error) {
    response.json(null);
  }
});

router.post("/sessions", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const email: unknown = request.body?.email;
    const password: unknown = request.body?.password;

    if (typeof email !== "string") throw new HttpError("email must be a string", 400);
    if (typeof password !== "string") throw new HttpError("password must be a string", 400);

    const [user, token] = await UsersService.signIn(email, password);

    response.cookie(environment.SESSION_COOKIE, token, { httpOnly: true, maxAge: ONE_DAY_IN_MS });
    response.json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/sessions", async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.clearCookie(environment.SESSION_COOKIE);
    response.send();
  } catch (error) {
    next(error);
  }
});

export default router;
