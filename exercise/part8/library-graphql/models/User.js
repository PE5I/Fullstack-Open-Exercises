const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4
  }
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)