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
  validateDeleteCard,
  validateLikeCard,
  validateDislikeCard,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateDeleteCard, deleteCard);
router.put('/:cardId/likes', validateLikeCard, likeCard);
router.delete('/:cardId/likes', validateDislikeCard, dislikeCard);

module.exports = router;
