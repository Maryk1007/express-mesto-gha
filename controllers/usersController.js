const User = require('../models/userModel');
const CastError = require('../errors/cast-error');
const NotFoundError = require('../errors/not-found-error');

/** добавить пользователя */
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Введены некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

/** получить всех пользователей */
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(next);
};

/** получить пользователя по ID */
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введен некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

/** обновить данные пользователя */
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User
    .findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      const err = new Error('Пользователь по указанному id не найден');
      err.name = 'NotFoundError';
      throw err;
    })
    .then((user) => {
      res
        .status(200)
        .send({ user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Введены некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

/** обновить аватар пользователя */
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User
    .findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      const err = new Error('Пользователь по указанному id не найден');
      err.name = 'NotFoundError';
      throw err;
    })
    .then((user) => {
      res
        .status(200)
        .send({ user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Введены некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};
