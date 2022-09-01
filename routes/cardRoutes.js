const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cardsController');

const {
  validateCreateCard,
  validateCurrentCard,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCurrentCard, deleteCard);
router.put('/:cardId/likes', validateCurrentCard, likeCard);
router.delete('/:cardId/likes', validateCurrentCard, dislikeCard);

module.exports = router;
