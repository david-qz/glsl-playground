/*******************************************************************************
 * Routes here belong to the API. All routes here assume API_PREFIX. In local
 * development, this is assumed to be /api/v1. See the Vite configuration.
 ******************************************************************************/
import { type NextFunction, type Request, type Response, Router } from "express";
import HttpError from "./utils/http-error.js";
import usersController from "./controllers/users-controller.js";
import programsController from "./controllers/programs-controller.js";

const router = Router();

router.use("/users", usersController);
router.use("/programs", programsController);

router.use("*", (request: Request, response: Response, next: NextFunction) => {
  next(new HttpError(`'${request.originalUrl}' not found`, 404));
});

export default router;
