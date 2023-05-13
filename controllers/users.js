const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: 'Server error' }))
}

const getUserById = (req, res) => {
  const { userId } = req.params
  User.findById(userId)
    .then(user => res.send(user))
    .catch(err => res.status(404).send({ message: 'Error: User not found' }))
}

const createUser = (req, res) => {
  const userData = req.body;
  User.create(userData)
    .then(user => res.status(201).send(user))
    .catch(err => res.status(400).send({ message: 'Error: invalid data' }))
}

const updateProfile = (req, res) => {
  const userData = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, userData, { new: true })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Server error' }))
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Server error' }))
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar
}