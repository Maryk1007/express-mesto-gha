const cardRouter = require('express').Router();
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

cardRouter.get('/', getCards);
cardRouter.post('/', validateCreateCard, createCard);
cardRouter.delete('/:cardId', validateCurrentCard, deleteCard);
cardRouter.put('/:cardId/likes', validateCurrentCard, likeCard);
cardRouter.delete('/:cardId/likes', validateCurrentCard, dislikeCard);

module.exports = cardRouter;
