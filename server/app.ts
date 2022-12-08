/*******************************************************************************
 * All general routes are handled in this file - all routes agnostic of the API
 * itself. This includes global middleware, general handlers (like 404 and error
 * handling) as well as static asset hosting.
 *
 * For api routes, see api.ts.
 ******************************************************************************/
import environment from './environment.js';
import express, { type Request, type Response } from 'express';
import path from 'node:path';
import api from './api.js';
import expressStaticGzip from 'express-static-gzip';
import errorHandler from './middleware/error.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(environment.API_PREFIX, api);

// Ordinarily we'd use __dirname as a base directory, but issues that arise from
// https://github.com/kulshekhar/ts-jest/issues/1174 cause problems with not
// being able to use import.meta.url (our module equivalent of __dirname). Our
// settings are covered according to the various guides. Using $PWD (what
// process.cwd() returns) may not be safe in all occasions, but should be good
// enough since we control the deployment context.
const publicDir = path.join(process.cwd(), 'public');
app.use(expressStaticGzip(publicDir, {
  enableBrotli: true,
  orderPreference: ['br'],
  serveStatic: {
    setHeaders: (response, path, stat) => {
      if (path.match(/\.obj(\.br|\.gz)?$/)) {
        response.setHeader('Content-Type', 'text/plain');
      }
    }
  }
}));

// Sending our index.html to the client on a 404 is required to make HTML5
// routes. HTML5 routes are the routes using the paths instead of the
// fake paths after the anchor (#) in the URL.
app.all('*', (req: Request, res: Response) => {
  res.status(404).sendFile(path.join(publicDir, 'index.html'));
});

app.use(errorHandler);

export default app;
