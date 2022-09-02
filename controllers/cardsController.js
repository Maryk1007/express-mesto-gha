const Card = require('../models/cardModel');
const ForbiddenError = require('../errors/forbidden-error');
const CastError = require('../errors/cast-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CastError).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card
    .findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .then((card) => {
      if (String(userId) !== String(card.owner._id)) {
        throw new ForbiddenError('Невозможно удалить чужую карточку');
      }
      Card
        .findByIdAndRemove(cardId)
        .then(() => {
          res.send({ data: card });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий id карточки');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий id карточки');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};
