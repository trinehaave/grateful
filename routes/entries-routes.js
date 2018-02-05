const express = require('express')
const EntryModel = require('../models/entries-model')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('../config')
mongoose.Promise = global.Promise

const entryCollection = mongoose.connection.collection('entries')

const router = express.Router()

// Middleware
router.use((req, res, next) => {
  console.log('route middleware')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

// middleware for to verify credentials
router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  const token = req.headers.authorization || req.body.token
  if (!token) {
    res.status(401).json('Not authorized')
    return
  }
  jwt.verify(token, config.SECRET, (error, decode) => {
    if (error) {
      res.status(500).json({
        message: 'Token is not valid'
      })
      return
    }
    req.user = decode
    next()
  })
})

router.route('/searchByUser/:userId')
  .get((req, res) => {
    EntryModel
      .find({authorId: req.params.userId})
      .sort({
        date: 1
      })
      .then((entries) => {
        res.status(200).json(entries)
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send('something has happened')
      })
  })

router.route('/:entryId')
  .get((req, res) => {
    EntryModel.find({
      _id: req.params.entryId
    })
      .then((entry) => {
        res.status(200).json(entry)
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send('something has happened')
      })
  })

router.route('/')
  .post((req, res) => {
    let newEntry = new EntryModel()
    newEntry.author = req.body.author
    newEntry.authorId = req.body.authorId
    newEntry.gratefuls = req.body.gratefuls
    newEntry.goalTomorrow = req.body.goalTomorrow

    newEntry.save()
      .then((entry) => {
        res.status(200).json({
          message: 'entry has been saved',
          data: entry
        })
      })
      .catch(() => {
        res.status(500).send('Something went wrong :(')
      })
  })

router.route('/deleteAll')
  .delete((req, res) => {
    entryCollection.drop()
      .then((result) => {
        res.status(200).send('Entry database cleared')
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send('Something went wrong :(')
      })
  })

router.route('/delete/:entryId')
  .delete((req, res) => {
    EntryModel.findOneAndRemove({
      _id: req.params.entryId
    })
      .then(() => {
        res.status(200).send('Entry has been deleted')
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send('Something went wrong :(')
      })
  })

router.route('/:entryId')
  .put((req, res) => {
    EntryModel.findOneAndUpdate({
      _id: req.params.entryId
    }, {
      $set: {
        author: req.body.author,
        gratefuls: req.body.gratefuls,
        goalTomorrow: req.body.goalTomorrow
      }
    }, {
      new: true
    }).exec(
      function (err, entry) {
        if (err || !entry) {
          console.log(err)
          return res.status(500).json({
            message: 'Internal Server Error'
          })
        }
        res.status(200).json(entry)
      })
  })

module.exports = router
