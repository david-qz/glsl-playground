import { type Request, type Response, type NextFunction, Router } from 'express'
import db from '../database.js'
import { type Foo } from '../../common/foo.js'
import { type QueryResult } from 'pg'


export default Router()
  .get('/', (req: Request, res: Response, next: NextFunction) => {
    return db.query('select * from foos;')
      .then((result: QueryResult<Foo>) => res.send(result.rows))
      .catch(next)
  })
  .delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    if(req.params.id != null && Number.isInteger(parseInt(req.params.id))) {
      return db.query('delete from foos where foos.id = $1;', [req.params.id])
        .then(() => res.sendStatus(201))
        .catch(next)
    } else {
      console.error(
        `id to delete is not a valid id: ${JSON.stringify(req.params.id)}`,
      )
      res.status(400)
    }
  })
