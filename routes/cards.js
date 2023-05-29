const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

const {
  createCardValidation,
} = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', createCardValidation, createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
