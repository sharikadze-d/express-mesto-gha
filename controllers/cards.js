const http2 = require('http2');

const NotFoundError = require('../errors/NotFoundError');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;
const Card = require('../models/card');
const { checkAviability } = require('../utils/utils');

const handleError = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
    return;
  }
  if (err.name === 'NotFoundError') {
    res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
    return;
  }
  res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере.' });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => handleError(err, res));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Not Found');
      }
      if (req.user._id !== card.owner._id.toString()) {
        throw new Error('Ошибка доступа');
      }
      card.deleteOne();
      res.send(card);
    })
    .catch((err) => handleError(err, res));
};

const addLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => checkAviability(card, res))
    .catch((err) => handleError(err, res));
};
const removeLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => checkAviability(card, res))
    .catch((err) => handleError(err, res));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
