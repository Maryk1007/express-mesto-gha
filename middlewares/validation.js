const { celebrate, Joi } = require('celebrate');
const { regexURL } = require('../helpers/constants');

// валидация при добавлении нового пользователя
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegExp(regexURL)),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// валидация при аутентификации
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// валидация при поиске пользователя по id
const validateGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

// валидация при обновлении аватара и данных пользователя
const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(RegExp(regexURL)),
  }),
});

// валидация при добавлении карточки
const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(RegExp(regexURL)),
  }),
});

// валидация при удалении, лайке и дизлайке карточки
const validateCurrentCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateGetUserById,
  validateUpdateUser,
  validateUpdateAvatar,
  validateCreateCard,
  validateCurrentCard,
};
