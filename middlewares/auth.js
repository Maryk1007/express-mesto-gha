const jwt = require('../helpers/jwt');
const { SECRET_KEY } = require('../helpers/jwt');
// const User = require('../models/userModel');

const UnauthorizedError = require('../errors/unauthorized-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UnauthorizedError).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(UnauthorizedError).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
