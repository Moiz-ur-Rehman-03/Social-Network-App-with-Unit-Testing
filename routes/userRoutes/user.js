const router = require('express').Router();
const { updateUser: updateValidation, idUser: userIdValidation } = require('../../middleware/joi_validation/user');
const { updateUser, deleteUser, getUser, followUser, unfollowUser } = require('../../controllers/userControllers/user');

// update user
router.put('/', updateValidation, updateUser);

// delete user
router.delete('/', userIdValidation, deleteUser);

// get a user
router.get('/:username', getUser);

// follow a user
router.put('/:username/follow', userIdValidation, followUser);

// unfollow a user
router.put('/:username/unfollow', userIdValidation, unfollowUser);

// exporting routes
module.exports = router;
