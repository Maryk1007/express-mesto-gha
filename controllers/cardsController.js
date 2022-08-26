/* eslint-disable no-unused-vars */
const Card = require('../models/cardModel');

const VALIDATION_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const ERROR_CODE = 500;

// получить все карточки
module.exports.getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => {
      res
        .status(200)
        .send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// создать карточку
module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => {
      res
        .status(201)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      if (err.name === 'Error') {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// удалить карточку по ID
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card
    .findById(cardId)
    .orFail((err) => {
      if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным id не найдена' });
      }
    })
    .then((card) => {
      if (String(userId) !== String(card.owner._id)) {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      }
      Card
        .findByIdAndRemove(cardId)
        .then(() => {
          res
            .status(200)
            .send({ data: card });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      if (err.name === 'Error') {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным id не найдена' });
      }
      if (err.name === 'Error') {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// удалить лайк у карточки
module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным id не найдена' });
      }
      res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      if (err.name === 'Error') {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};
