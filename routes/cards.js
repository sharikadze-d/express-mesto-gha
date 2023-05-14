const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike } = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', removeLike)

module.exports = router;