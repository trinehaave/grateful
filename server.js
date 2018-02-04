const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const entriesRoutes = require('./routes/entries-routes')
const userRoutes = require('./routes/user-routes')
const authRoutes = require('./routes/auth-routes')
const {
  DATABASE_URL,
  PORT
} = require('./config')
mongoose.Promise = global.Promise

const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use(morgan('common'))

app.use(express.static(__dirname + '/public'))

/* any call that starts with /entries, use entriesRoutes
which is found at ./routes/entries-routes and so on */
app.use('/entries', entriesRoutes)

app.use('/user', userRoutes)

app.use('/auth', authRoutes)

let server

function runServer (databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {
      useMongoClient: true
    })
    let db = mongoose.connection
    db.on('error', err => {
      mongoose.disconnect()
      reject(err)
      console.log(`server connection error: ${err}`)
    })
    db.once('open', () => {
      console.log(`connected to database: ${databaseUrl}`)
    })
    server = app.listen(port, () => {
      console.log(`your server is running on port: ${port}`)
      resolve()
    })
  })
}

function closeServer () {
  return mongoose.disconnect()
    .then(() => {
      return new Promise((resolve, reject) => {
        console.log('closing server')
        server.close((err) => {
          process.exit(0)
          if (err) {
            return reject()
          }
          resolve()
        })
      })
    })
}

/* if server.js is called directly (aka, with `node server.js`), this block
 runs. but we also export the runServer command so other code
(for instance test code) can start the server as needed. */

if (require.main === module) {
  runServer().catch(err => console.error(err))
}

module.exports = {
  runServer,
  app,
  closeServer
}
