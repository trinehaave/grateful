const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')
const {
  TEST_DATABASE_URL
} = require('../config')

mongoose.Promise = global.Promise

// this makes the should syntax available throughout
// this module
const should = chai.should()

const entries = require('../models/entries-model')
const {
  closeServer,
  runServer,
  app
} = require('../server')
let db = mongoose.connection
let token
let userId

chai.use(chaiHttp)

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb () {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database')
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  })
}

describe('entries API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })
  after(function () {
    return tearDownDb()
  })
  after(function () {
    return closeServer()
  })

  describe('GET endpoint', function () {
    it('should register new user', function () {
      let res
      return chai.request(app)
        .post('/auth/register')
        .send({
          username: 'test',
          password: 'test'
        })
        .then((_res) => {
          res = _res
          res.should.have.status(200)
        })
    })

    it('should login user', function () {
      let res
      return chai.request(app)
        .post('/auth/login')
        .send({
          username: 'test',
          password: 'test'
        })
        .then((_res) => {
          res = _res
          res.should.have.status(200)
          token = res.body.token
          userId = res.body.userId
        })
    })

    it('create a new entry', function () {
      let res
      return chai.request(app)
        .post('/entries')
        .set('Authorization', token)
        .send({
          authorId: userId,
          gratefuls: faker.lorem.text()
        })
        .then((_res) => {
          res = _res
          res.should.have.status(200)
        })
    })

    it('should test to see if status code 200 and html is returned', function () {
      let res
      return chai.request(app)
        .get('/')
        .then(_res => {
          res = _res
          res.should.have.status(200)
          res.should.be.html
        })
    })

    it('should return all existing entries', function () {
      let res
      return chai.request(app)
        .get('/entries/searchByUser/' + userId)
        .set('Authorization', token)
        .then(_res => {
          res = _res
          res.should.have.status(200)
          res.body.should.have.length.of.at.least(1)
        })
    })

    it('should delete entry by id', function () {
      let entry
      let res
      return entries.findOne()
        .then(function (_entry) {
          entry = _entry
          return chai.request(app)
            .delete('/entries/delete/' + entry._id)
            .set('Authorization', token)
            .then(_res => {
              res = _res
              res.should.have.status(200)
            })
        })
    })
  })
})
