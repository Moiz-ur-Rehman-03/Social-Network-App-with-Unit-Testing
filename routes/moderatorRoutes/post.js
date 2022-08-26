const router = require('express').Router();
const { updatePostModerator: updateValidation } = require('../../middleware/joi_validation/post');
const { idModerator: moderatorIdValidation } = require('../../middleware/joi_validation/moderator');
const { updatePost, deletePost, getPost } = require('../../controllers/moderatorControllers/post');

// update a post
router.put('/:id', updateValidation, updatePost);

// delete a post
router.delete('/:id', moderatorIdValidation, deletePost);

// get a post
router.get('/:id', moderatorIdValidation, getPost);

// exporting routes
module.exports = router;
