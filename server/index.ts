import environment from "./environment.js";
import app from "./app.js";
import { db, migrator } from "./database/db.js";

async function start() {
  const migrationResultSet = await migrator.migrateToLatest();

  for (const result of migrationResultSet.results || []) {
    console.log(`${result.status}: ${result.direction} ${result.migrationName}`);
  }

  if (migrationResultSet.error) {
    const error = migrationResultSet.error as any;
    console.log(`${error.stack || error}`);
    process.exit(1);
  }

  const server = app.listen(environment.PORT, () => {
    console.log("Started server on ", server.address());
  });

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  async function shutdown() {
    console.log("Shutting down server...");
    await new Promise((r) => server.close(r));
    await db.destroy();
    process.exit(0);
  }
}

start();
