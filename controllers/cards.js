const { HTTP_STATUS_CREATED } = require('http2').constants;

const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/SererError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const Card = require('../models/card');
const { checkAviability } = require('../utils/utils');

const handleError = (err, next) => {
  (function switchError() {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return Promise.reject(new ValidationError('Переданы некорректные данные при создании карточки.'));
    }
    if (err.name === 'NotFoundError') {
      return Promise.reject(new NotFoundError('Карточка с указанным _id не найдена.'));
    }
    if (err.name === 'ForbiddenError') {
      return Promise.reject(new ForbiddenError('Ошибка доступа.'));
    }
    return Promise.reject(new ServerError('Произошла ошибка на сервере.'));
  }())
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, next));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => handleError(err, next));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      if (req.user._id !== card.owner._id.toString()) {
        throw new ForbiddenError('Ошибка доступа.');
      }
      return card.deleteOne();
    })
    .then((card) => res.send(card))
    .catch((err) => handleError(err, next));
};

const addLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => checkAviability(card, res))
    .catch((err) => handleError(err, next));
};
const removeLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => checkAviability(card, res))
    .catch((err) => handleError(err, next));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
