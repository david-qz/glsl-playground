/*******************************************************************************
 * All general routes are handled in this file - all routes agnostic of the API
 * itself. This includes global middleware, general handlers (like 404 and error
 * handling) as well as static asset hosting.
 *
 * For api routes, see api.ts.
 ******************************************************************************/
import environment from "./environment.js";
import express, { type Request, type Response } from "express";
import path from "node:path";
import api from "./api.js";
import expressStaticGzip from "express-static-gzip";
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", api);

const publicDir = path.join(process.cwd(), "public");
app.use(
  expressStaticGzip(publicDir, {
    enableBrotli: true,
    orderPreference: ["br"],
    serveStatic: {
      setHeaders: (response, path, stat) => {
        if (path.match(/\.obj(\.br|\.gz)?$/)) {
          response.setHeader("Content-Type", "text/plain");
        }
        if (!path.match(/index\.html$/)) {
          response.setHeader("Cache-Control", "public, max-age=14400");
        }
      },
    },
  }),
);

app.all("*", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(publicDir, "index.html"));
});

app.use(errorHandler);

export default app;
