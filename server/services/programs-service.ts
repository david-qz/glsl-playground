import { db } from "../database/db.js";
import type { Program, ProgramInsert, ProgramUpdate } from "../database/types.js";

export class ProgramsService {
  static async getById(id: string): Promise<Program | undefined> {
    const program = await db.selectFrom("programs").selectAll().where("id", "=", id).executeTakeFirst();
    return program;
  }

  static async getByUserId(userId: string): Promise<Program[]> {
    const programs = await db.selectFrom("programs").selectAll().where("userId", "=", userId).execute();
    return programs;
  }

  static async insert(program: ProgramInsert): Promise<Program | undefined> {
    const newProgram = await db.insertInto("programs").values(program).returningAll().executeTakeFirst();
    return newProgram;
  }

  static async update(id: string, program: ProgramUpdate): Promise<Program | undefined> {
    const updatedProgram = await db
      .updateTable("programs")
      .set(program)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    return updatedProgram;
  }

  static async delete(id: string): Promise<void> {
    await db.deleteFrom("programs").where("id", "=", id).execute();
  }
}
