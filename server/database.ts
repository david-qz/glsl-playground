import environment from './environment.js';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: environment.DATABASE_URL,
  ssl: environment.PGSSLMODE && { rejectUnauthorized: false },
});

pool.on('connect', () => console.log('🐘 Postgres connected'));

export default pool;
