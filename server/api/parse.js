const router = require('express').Router()
const parse = require('./../services/csvparse')
const csvsync = require('csvsync')
const fs = require('fs')
const isUserMiddleware = require('../auth/isUser')
const Pool = require('pg').Pool

let pool

if (process.env.NODE_ENV !== 'production') {
  pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    database: 'qabin',
    //   password: "123",
    port: 5432
  })
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })
}
module.exports = router

// make sure the userId is being identified when the front-ends sends the array of filepaths

router.post('/:userId/parse', isUserMiddleware, (req, res, next) => {
  try {
    const tables = req.body.tableData
    let parsedTablesArr = []

    for (let i = 0; i < tables.length; i++) {
      let table = tables[i]

      let [tableName] = Object.keys(table) // to get the file name for the table obj
      let {filepath, headers} = table[tableName]

      parse(tableName, filepath, headers) //getting the fields property that contains the headers of the table along with the datatype
    }

    res.sendStatus(201)
  } catch (error) {
    console.log(error)
  }
})

router.post('/:userId', isUserMiddleware, (req, res, next) => {
  try {
    const getFile = req.body.filepaths
    let nameArr = []
    getFile.forEach(file => {
      let fileName = file.split('/') // to get the file name for the table name
      fileName = fileName[fileName.length - 1].split('.') //getting last leg of the path of the file name
      // parse(`user${req.params.userId}_${fileName[0]}`, file) //use last leg of the file name to convert it into a table name in addition to the user.id identifier
      nameArr.push(`user${req.params.userId}_${fileName[0]}`.toLowerCase())
    })
    res.status(201).send({nameArr: nameArr})
  } catch (error) {
    console.log(error)
  }
})

// was a GET route before switching to https://github.com/bradtraversy/design-resources-for-developersUT for partial parse
router.put('/:userId/:tableNames', isUserMiddleware, async (req, res, next) => {
  try {
    const hold = () => {
      return 'Loading'
    }
    const getFile = req.body.filepaths
    const allTables = []
    const tables = req.params.tableNames.split(',')
    for (let i = 0; i < tables.length; i++) {
      let table = tables[i]
      let file = getFile[i]
      let csv = fs.readFileSync(file)
      let data = csvsync.parse(csv).slice(0, 3)
      let headers = data.shift()
      let tableData = {}
      tableData.rows = []
      tableData.filepath = file
      for (let j = 0; j < data.length; j++) {
        let obj = {}
        let index = 0
        for (const key of headers) {
          obj[key] = data[j][index]
          index++
        }
        tableData.rows.push(obj)
      }

      // let query = `SELECT * FROM ${table}`
      // let rows = await pool.query(query)
      // fs.close(csv, () => console.log('file closed'))
      allTables.push({[table]: tableData})
    }
    res.send(allTables)
  } catch (error) {
    next(error)
  }
})
