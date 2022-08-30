const router = require('express').Router();
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

const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', getMe);
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
