const bcrypt = require('bcrypt');
const http2 = require('http2');

const { getJwtToken } = require('../utils/jwt');

const NotFoundError = require('../errors/NotFoundError');
const AlreadyExistError = require('../errors/AlreadyExistError');
const ServerError = require('../errors/SererError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthoriedError');

const SALT_ROUNDS = 10;

const {
  HTTP_STATUS_CREATED,
} = http2.constants;
const User = require('../models/user');
const { checkAviability } = require('../utils/utils');

const handleError = (err, next) => {
  (function switchError() {
    if (err.code === 11000) {
      return Promise.reject(new AlreadyExistError('Пользователь с таким email уже существует'));
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return Promise.reject(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
    }
    if (err.name === 'NotFoundError') {
      return Promise.reject(new NotFoundError('Пользователь по указанному _id не найден.'));
    }
    return Promise.reject(new ServerError('Произошла ошибка на сервере.'));
  }())
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, next));
};

const createUser = (req, res, next) => {
  const userData = req.body;
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({ ...userData, password: hash }))
    .then((user) => user.toObject({ useProjection: true }))
    .then((noPassUser) => res.status(HTTP_STATUS_CREATED).send(noPassUser))
    .catch((err) => handleError(err, next));
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => checkAviability(user, res))
    .catch((err) => handleError(err, next));
};

const updateProfile = (req, res, next) => {
  const userData = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, userData, { new: true, runValidators: true })
    .then((user) => checkAviability(user, res))
    .catch((err) => handleError(err, next));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => checkAviability(user, res))
    .catch((err) => handleError(err, next));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError('Неверный email или пароль');
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверный email или пароль');
          }
          res.send({ jwt: getJwtToken(user._id) });
        })
        .catch(next);
    })
    .catch(next);
};

const getUserData = (req, res) => {
  User.findById(req.user._id)
    .then((user) => checkAviability(user, res))
    .catch((err) => handleError(err, res));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserData,
};
