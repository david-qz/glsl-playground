import { type NextFunction, type Request, type Response, Router } from "express";
import authenticate from "../middleware/authenticate.js";
import HttpError from "../utils/http-error.js";
import { ProgramsService } from "../services/programs-service.js";
import type { ProgramInsert, ProgramUpdate } from "../database/types.js";
import crypto from "node:crypto";

const router = Router();

router.get("/:id", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = request.params.id!;
    const program = await ProgramsService.getById(id);

    if (!program) throw new HttpError("not found", 404);

    response.json(program);
  } catch (error) {
    next(error);
  }
});

router.get("/", [authenticate], async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.user!;
    const programs = await ProgramsService.getByUserId(user.id);

    response.json(programs);
  } catch (error) {
    next(error);
  }
});

router.post("/", [authenticate], async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.user!;

    const data: ProgramInsert = request.body;
    data.userId = user.id;
    data.id = crypto.randomUUID();
    const program = await ProgramsService.insert(data);

    response.json(program);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", [authenticate], async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = request.params.id!;
    const user = request.user!;

    const originalProgram = await ProgramsService.getById(id);
    if (!originalProgram) throw new HttpError("not found", 404);
    if (originalProgram.userId !== user.id) throw new HttpError("forbidden", 403);

    const data: ProgramUpdate = request.body;
    data.userId = user.id;
    const updatedProgram = await ProgramsService.update(id, data);

    response.json(updatedProgram);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", [authenticate], async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = request.params.id!;
    const user = request.user!;

    const program = await ProgramsService.getById(id);
    if (!program) throw new HttpError("not found", 404);
    if (program.userId !== user.id) throw new HttpError("forbidden", 403);

    await ProgramsService.delete(id);

    response.json(program);
  } catch (error) {
    next(error);
  }
});

export default router;
