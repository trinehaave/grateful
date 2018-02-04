const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  username: String,
  password: String,
  date: {type: String, default: new Date()}
})

module.exports = mongoose.model('user', userSchema)
