const Card = require('../models/cardModel');
const ForbiddenError = require('../errors/forbidden-error');
const CastError = require('../errors/cast-error');
const NotFoundError = require('../errors/not-found-error');

// получить все карточки
module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

// создать карточку
module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CastError).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        next(err);
      }
    });
};

// удалить карточку по ID
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
        next(new ForbiddenError('Невозможно удалить чужую карточку'));
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

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

// удалить лайк у карточки
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};
