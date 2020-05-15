const router = require('express').Router()
const Pool = require('pg').Pool
const queryParser = require('../services/queryParser')
const isUserMiddleware = require('../auth/isUser')

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'dummy1-qbp',
  //   password: "123",
  port: 5432,
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0
})
//queries/query/1
router.put('/:userId/query', isUserMiddleware, async (req, res, next) => {
  try {
    const allTables = []
    const tables = Object.keys(req.body.queryBundle)

    for (let i = 0; i < tables.length; i++) {
      let table = tables[i]

      let query = queryParser(
        table,
        req.body.queryBundle[table],
        req.body.queryBundle
      )

      let rows = await pool.query(query)

      allTables.push({[table]: rows})
    }
    res.send(allTables)
  } catch (err) {
    next(err)
  }
})

router.get('/query/sample', isUserMiddleware, async (req, res, next) => {
  try {
    const allTables = []
    const tables = Object.keys(req.body.userTables)

    for (let i = 0; i < tables.length; i++) {
      let table = tables[i]

      let query = `SELECT * FROM ${table}`

      let {rows} = await pool.query(query)

      allTables.push({[table]: rows})
    }
    res.send(allTables)
  } catch (err) {
    next(err)
  }
})

module.exports = router
