const express = require('express')
const UserModel = require('../models/user-model')
const mongoose = require('mongoose')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const config = require('../config')
mongoose.Promise = global.Promise

const router = express.Router()

// Middleware
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

// create new user account
router.route('/register')
  .post((req, res) => {
    UserModel.findOne({
      username: req.body.username
    })
      .then((user) => {
        if (user) {
          res.status(401).json('user already exists')
          return
        }
        let newUser = new UserModel()
        newUser.username = req.body.username
        newUser.password = passwordHash.generate(req.body.password)
        newUser.save()
          .then(() => {
            res.status(200).send('User has been saved')
          })
          .catch(() => {
            res.status(500).send('Something went wrong :(')
          })
      })
      .catch((error) => {
        res.json('something has happened')
      })
  })

router.route('/login')
  .post((req, res) => {
    UserModel.findOne({
      username: req.body.username
    })
      .then((user) => {
        if (!user) {
          res.status(404).json('Password and/or username is wrong')
          return
        }
        if (!passwordHash.verify(req.body.password, user.password)) {
          res.status(400).send('Password and/or username is wrong')
          return
        }
        let tokenUser = {
          username: user.username
        }
        let token = jwt.sign(tokenUser, config.SECRET, {expiresIn: 60 * 60})
        res.status(200).json({
          token: token,
          userId: user._id
        })
      })
      .catch((error) => {
        res.json('something has happened')
      })
  })

module.exports = router
