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
  cardIdValidation,
} = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', createCardValidation, createCard);
router.delete('/cards/:cardId', cardIdValidation, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidation, addLike);
router.delete('/cards/:cardId/likes', cardIdValidation, removeLike);

module.exports = router;
