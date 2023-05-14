const Card = require('../models/card');
const { checkAviability } = require('../utils/utils');

const handleError = (err, res) => {
  if(err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' })
    return;
  }
  if(err.name === 'NotFoundError') {
    res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    return;
  }
  res.status(500).send({ message: `${err.name}: ${err.message}` });
}

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => handleError(err, res))
}

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id
  Card.create({ name, link, owner })
    .then(card => checkAviability(card, res))
    .catch(err => handleError(err, res))
}

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then(card => checkAviability(card, res))
    .catch(err => handleError(err, res))
}

const addLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then(card => checkAviability(card, res))
    .catch(err => handleError(err, res))
}
const removeLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then(card => checkAviability(card, res))
    .catch(err => handleError(err, res))
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike
}