import environment from './environment.js';
import pg from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';

const pool = new pg.Pool({
  connectionString: environment.DATABASE_URL,
  ssl: environment.PGSSLMODE && { rejectUnauthorized: false },
});
pool.on('connect', () => console.log('🐘 Postgres connected'));
export default pool;

const setupQueryPromise: Promise<string> = fs.readFile(path.resolve('./sql/setup.sql'), { encoding: 'utf-8' });
const seedQueryPromise: Promise<string> = fs.readFile(path.resolve('./sql/seed.sql'), { encoding: 'utf-8' });

export async function setupDatabase() {
  const setupQuery = await setupQueryPromise;
  return await pool.query(setupQuery);
}

export async function seedDatabase() {
  const seedQuery = await seedQueryPromise;
  return await pool.query(seedQuery);
}
