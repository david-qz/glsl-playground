import environment from "./environment.js";
import pg from "pg";
import fs from "node:fs/promises";
import path from "node:path";

const pool = new pg.Pool({
  connectionString: environment.DATABASE_URL,
  ssl: environment.PGSSLMODE && { rejectUnauthorized: false },
});
export default pool;

const setupQueryPromise: Promise<string> = fs.readFile(path.join(__dirname, "sql/setup.sql"), { encoding: "utf-8" });
const seedQueryPromise: Promise<string> = fs.readFile(path.resolve(__dirname, "sql/seed.sql"), { encoding: "utf-8" });

export async function setupDatabase(): Promise<pg.QueryResult> {
  const setupQuery = await setupQueryPromise;
  return await pool.query(setupQuery);
}

export async function seedDatabase(): Promise<pg.QueryResult> {
  const seedQuery = await seedQueryPromise;
  return await pool.query(seedQuery);
}
