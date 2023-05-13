const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(500).send({ message: 'Server error' }))
}

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id
  Card.create({ name, link, owner })
    .then(card => res.status(201).send(card))
    .catch(err => res.status(400).send({ message: 'Error: invalid data' }))
}

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then(card => res.send(card))
    .catch(err => res.status(404).send({ message: 'Error: card not found' }))
}

const addLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: 'Server error' }))
}
const removeLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: 'Server error' }))
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike
}