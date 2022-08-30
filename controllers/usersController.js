const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const CastError = require('../errors/cast-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const { generateToken } = require('../helpers/jwt');

const ERROR_CODE = 500;

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

// добавить пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => (
      User
        .create({
          email,
          password: hash,
          name,
          about,
          avatar,
        })
    ))
    .then((user) => {
      res.send({
        user: {
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CastError).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с указанным email уже существует'));
      } else {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new UnauthorizedError('Укажите email или пароль');
  }
  return User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        const err = new UnauthorizedError('Некорректная почта или пароль');
        err.statusCode = 'UnauthorizedError';
        throw err;
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        const err = new UnauthorizedError('Некорректная почта или пароль');
        err.statusCode = 'UnauthorizedError';
        throw err;
      }
      return generateToken({ email: user.email });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 'CastError') {
        next(new CastError('Введены некорректные данные пользователя'));
      } else if (err.statusCode === 'UnauthorizedError') {
        next(new UnauthorizedError('Некорректная почта или пароль'));
      } else {
        next(err);
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

// получить текущего пользователя
module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
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

// получить пользователя по ID
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CastError).send({ message: 'Введены некорректные данные' });
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
        res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(CastError).send({ message: 'Переданы некорректные данные при обновлении профиля' });
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
        res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(CastError).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};
