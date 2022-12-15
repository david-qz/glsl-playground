/*******************************************************************************
 * This is the entry point for the server. This is separated from all of the
 * route registration to help Supertest auto-start the server without the server
 * having already been started. See
 * https://github.com/visionmedia/supertest/issues/697 for more context on this
 * issue.
 *
 * Any deployments will need to execute the transpiled version of this file.
 ******************************************************************************/
import environment from "./environment.js";
import app from "./app.js";

const server = app.listen(environment.PORT, () => {
  console.log("Started server on ", server.address());
});
