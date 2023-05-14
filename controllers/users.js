const User = require('../models/user');
const { checkAviability } = require('../utils/utils');

const handleError = (err, res) => {
  if(err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
    return;
  }
  if(err.name === 'NotFoundError' || err.name === 'CastError') {
    res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    return;
  }
  res.status(500).send({ message: `${err.name}: ${err.message}` });
}

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => handleError(err, res))
}

const createUser = (req, res) => {
  const userData = req.body;
  User.create(userData)
    .then(user => res.status(201).send(user))
    .catch(err => handleError(err, res))
}

const getUserById = (req, res) => {
  const { userId } = req.params
  User.findById(userId)
    .then(user => checkAviability(user, res))
    .catch(err => handleError(err, res))
}

const updateProfile = (req, res) => {
  const userData = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, userData, { new: true, runValidators: true })
    .then(user => checkAviability(user, res))
    .catch(err => handleError(err, res))
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then(user => checkAviability(user, res))
    .catch(err => handleError(err, res))
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar
}