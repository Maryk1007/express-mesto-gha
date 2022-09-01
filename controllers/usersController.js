const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const CastError = require('../errors/cast-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const { generateToken } = require('../helpers/jwt');

const SALT_ROUNDS = 10;

// добавить пользователя
module.exports.createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  try {
    // if (!email || !password) {
    //   throw new CastError('Укажите email или пароль');
    // }
    const hash = await bcrypt
      .hash(password, SALT_ROUNDS);
    const user = await (
      User
        .create({
          email,
          password: hash,
          name,
          about,
          avatar,
        })
    );
    res.send({
      user: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new CastError('Введены некорректные данные пользователя'));
    } else if (err.code === 11000) {
      next(new ConflictError('Пользователь с указанным email уже существует'));
    } else {
      next(err);
    }
  }
};

// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   res.status(401).send({ message: 'Укажите email или пароль' });
  //   return;
  // }
  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Некорректная почта или пароль');
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new UnauthorizedError('Некорректная почта или пароль');
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
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(next);
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
      res.status(200).send({ data: user });
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
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введен некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

// обновить данные пользователя
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
      throw new Error('NotFoundError');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Введены некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

// обновить аватар пользователя
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
      throw new Error('NotFoundError');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Введены некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};
