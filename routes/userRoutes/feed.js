const router = require('express').Router();
const { idUser: userIdValidation } = require('../../middleware/joi_validation/user');
const { feedUser } = require('../../controllers/userControllers/feed');

// user feed
router.get('/', userIdValidation, feedUser);

// exporting routes
module.exports = router;
