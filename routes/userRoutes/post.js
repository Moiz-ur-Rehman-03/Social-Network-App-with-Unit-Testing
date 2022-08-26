const router = require('express').Router();
const { uploadPost: uploadValidation, updatePost: updateValidation } = require('../../middleware/joi_validation/post');
const { idUser: userIdValidation } = require('../../middleware/joi_validation/user');
const { uploadPost, updatePost, deletePost, getPost } = require('../../controllers/userControllers/post');

// create a post
router.post('/', uploadValidation, uploadPost);

// update a post
router.put('/:id', updateValidation, updatePost);

// delete a post
router.delete('/:id', userIdValidation, deletePost);

// get a post
router.get('/:id', userIdValidation, getPost);

// exporting routes
module.exports = router;
