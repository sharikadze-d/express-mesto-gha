const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserData,
} = require('../controllers/users');

const {
  avatarUpdateValidation,
  profileUpdateValidation,
  userIdValidation,
} = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getUserData);
router.get('/users/:userId', userIdValidation, getUserById);
router.patch('/users/me', profileUpdateValidation, updateProfile);
router.patch('/users/me/avatar', avatarUpdateValidation, updateAvatar);

module.exports = router;
