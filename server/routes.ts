/*******************************************************************************
 * Routes here belong to the API. All routes here assume API_PREFIX. In local
 * development, this is assumed to be /api/v1. See the Webpack configuration
 * (webpack.config.js) for the re-writes to accomplish that.
 *
 * Since API_PREFIX adds the /api/v1, you needn't do it here in your routes.
 ******************************************************************************/

import express, { type Router } from 'express'
import fooController from './controllers/foos.js'
// Here we demonstrate that JavaScript files can be included from TypeScript
// files on the server side.
import catsController from './controllers/cats.js'


export default (): Router => {
  const prefixRouter = express.Router()
  // Think of the poor foos.
  prefixRouter.use('/foos', fooController)
  prefixRouter.use('/cats', catsController)

  return prefixRouter
}
