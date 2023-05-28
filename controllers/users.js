const bcrypt = require('bcrypt');
const http2 = require('http2');

const { getJwtToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CONFLICT,
} = http2.constants;
const User = require('../models/user');
const { checkAviability } = require('../utils/utils');

const handleError = (err, res) => {
  if (err.code === 11000) {
    res.status(HTTP_STATUS_CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
    return;
  }
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
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({ ...userData, password: hash }))
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

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid email or password' });
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid email or password' });
            return;
          }
          res.cookie('jwt', getJwtToken(user._id));
          res.send(getJwtToken(user._id));
        });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
