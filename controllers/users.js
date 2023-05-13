const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: 'Server error' }))
}

const getUserById = (req, res) => {
  const { id } = req.params
  User.findById(id)
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'User not found' }))
}

const createUser = (req, res) => {
  const userData = req.body;
  User.create(userData)
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send({ message: 'Server error' }))
}

module.exports = {
  getUsers,
  getUserById,
  createUser
}