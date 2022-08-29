const User = require('../models/userModel');

const VALIDATION_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const ERROR_CODE = 500;

// добавить пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// получить всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// получить пользователя по ID
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// обновить данные пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User
    .findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => {
      res
        .status(200)
        .send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// обновить аватар пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User
    .findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => {
      res
        .status(200)
        .send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};
