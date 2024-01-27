import environment from "./environment.js";
import app from "./app.js";

const server = app.listen(environment.PORT, () => {
  console.log("Started server on ", server.address());
});
