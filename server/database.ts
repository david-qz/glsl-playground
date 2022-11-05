import pg from 'pg'
// Even if redundantly done elsewhere. It needs to be done here though because
// the environment variable is used immediately. It cannot wait for later.
// Trying to run code inside of modules _before_ imports are done is impossible
// in a true module (which we use here).
import dotenv from 'dotenv'
dotenv.config()

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE == 'true' && { rejectUnauthorized: false },
});

pool.on('connect', () => console.log('🐘 Postgres connected'));

export default pool
