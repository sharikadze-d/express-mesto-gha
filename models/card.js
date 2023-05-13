const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    reqired: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    reqired: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: []
  }],
  createdAt: {}
});

module.exports = mongoose.model('card', cardSchema);