/*******************************************************************************
 * All general routes are handled in this file - all routes agnostic of the API
 * itself. This includes global middleware, general handlers (like 404 and error
 * handling) as well as static asset hosting.
 *
 * For routes for your API, see routes.ts.
 ******************************************************************************/

import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import path from 'node:path'
import routes from './routes.js'
import errorHandler from './middleware/error.js'

dotenv.config()

const app = express()

app.use(process.env.API_PREFIX || '', routes())
// Ordinarily we'd use __dirname as a base directory, but issues that arise from
// https://github.com/kulshekhar/ts-jest/issues/1174 cause problems with not
// being able to use import.meta.url (our module equivalent of __dirname). Our
// settings are covered according to the various guides. Using $PWD (what
// process.cwd() returns) may not be safe in all occasions, but should be good
// enough since we control the deployment context.
const publicDir = path.join(process.cwd(), 'public')
app.use(express.static(publicDir))
app.use(errorHandler)

// Sending our index.html to the client on a 404 is required to make HTML5
// routes. HTML5 routes are the routes using the paths instead of the
// fake paths after the anchor (#) in the URL.
app.all('*', (req: Request, res: Response) => {
  res.status(404).sendFile(path.join(publicDir, 'index.html'))
})

export default app
