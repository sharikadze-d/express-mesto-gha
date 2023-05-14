const http2 = require('http2');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;
const User = require('../models/user');
const { checkAviability } = require('../utils/utils');

const handleError = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    return;
  }
  if (err.name === 'NotFoundError') {
    res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
    return;
  }
  res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере.' });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, res));
};

const createUser = (req, res) => {
  const userData = req.body;
  User.create(userData)
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => handleError(err, res));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => checkAviability(user, res))
    .catch((err) => handleError(err, res));
};

const updateProfile = (req, res) => {
  const userData = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, userData, { new: true, runValidators: true })
    .then((user) => checkAviability(user, res))
    .catch((err) => handleError(err, res));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => checkAviability(user, res))
    .catch((err) => handleError(err, res));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
