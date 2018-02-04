const mongoose = require('mongoose')

let entrySchema = new mongoose.Schema({
  date: {type: String, default: new Date()},
  gratefuls: String,
  author: String,
  authorId: mongoose.Schema.ObjectId
})

module.exports = mongoose.model('entries', entrySchema)
