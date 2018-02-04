const express = require('express')
const UserModel = require('../models/user-model')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const userCollection = mongoose.connection.collection('user')

const router = express.Router()

router.route('/')
  .get((req, res) => {
    UserModel.find({})
      .then((users) => {
        res.status(200).json(users)
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send('something has happened')
      })
  })

router.route('/:username')
    .get((req, res) => {
      UserModel.find({
        username: req.params.username
      })
        .then((user) => {
          res.status(200).json(user)
        })
        .catch((error) => {
          console.log(error)
          res.status(500).send('something has happened')
        })
    })

router.route('/deleteAll')
  .delete((req, res) => {
    userCollection.drop()
      .then((result) => {
        res.status(200).send('User database cleared')
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send('Something went wrong :(')
      })
  })

router.route('/:username')
  .delete((req, res) => {
    UserModel.findOneAndRemove({
      username: req.params.username
    })
      .then(() => {
        res.status(200).send('User has been deleted')
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send('Something went wrong :(')
      })
  })

router.route('/:username')
    .put((req, res) => {
      UserModel.findOneAndUpdate({
        username: req.params.username
      }, {
        $set: {
          username: req.body.username,
          password: req.body.password
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
          console.log(entry)
          res.status(200).json(entry)
        })
    })

module.exports = router
