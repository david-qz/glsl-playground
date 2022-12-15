import pool, { setupDatabase } from "./server/database.js";

setupDatabase()
  .then(() => pool.end())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit());
