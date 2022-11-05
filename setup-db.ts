import setup from './server/setup-data.js'
import pool from './server/database.js'

setup()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    // Shut down the pool so we can exit (otherwise this hangs).
    return pool.end()
  })
  .finally(() => process.exit())
