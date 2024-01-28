import environment from "./environment.js";
import app from "./app.js";
import pool from "./database.js";

const server = app.listen(environment.PORT, () => {
  console.log("Started server on ", server.address());
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("Shutting down server.");
  server.close(() => {
    pool.end(() => {
      process.exit(0);
    });
  });
}
