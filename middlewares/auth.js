const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../helpers/jwt');
const User = require('../models/userModel');
const UnauthorizedError = require('../errors/unauthorized-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  User
    .findOne({ email: payload.email })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Необходима авторизация');
      }
      req.user = { _id: user._id };
      res.status(200);
      next();
    })
    .catch(next);
};
