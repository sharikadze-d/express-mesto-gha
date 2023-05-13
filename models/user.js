const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    reqired: true,
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    reqired: true,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    reqired: true,
  }
});

module.exports = mongoose.model('user', userSchema);