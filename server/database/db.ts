import environment from "../environment.js";
import { Pool } from "pg";
import { FileMigrationProvider, Insertable, Kysely, Migrator, PostgresDialect, Selectable, Updateable } from "kysely";
import { type DB, Programs, Users } from "./generated.js";
import fs from "node:fs/promises";
import path from "node:path";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: environment.DATABASE_URL,
    ssl: environment.PGSSLMODE && { rejectUnauthorized: false },
    max: 10,
  }),
});

export const db = new Kysely<DB>({ dialect });

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, "migrations"),
  }),
});
