const userRouter = require('express').Router();
const {
  getUsers,
  getMe,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/usersController');

const {
  validateGetUserById,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validation');

userRouter.get('/', getUsers);
userRouter.get('/me', getMe);
userRouter.get('/:userId', validateGetUserById, getUserById);
userRouter.patch('/me', validateUpdateUser, updateUser);
userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = userRouter;
