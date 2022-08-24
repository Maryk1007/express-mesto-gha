const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => {
      res
        .status(200)
        .send({ data: users });
    })
    .catch(next);
};
