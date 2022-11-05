/*******************************************************************************
 * This file demonstrates that JavaScript files can be imported from TypeScript
 * files on the server side.
 ******************************************************************************/

import { Router } from 'express'
import db from '../database.js'

export default Router()
  .get('/', (req, res) => {
    return db.query('select * from cats;')
      .then((result) => res.send(result.rows))
  })
