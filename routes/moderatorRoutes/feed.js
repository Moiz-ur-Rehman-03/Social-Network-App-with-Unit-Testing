const router = require('express').Router();
const { idModerator: moderatorIdValidation } = require('../../middleware/joi_validation/moderator');
const { feedModerator } = require('../../controllers/moderatorControllers/feed');

// moderator feed
router.get('/', moderatorIdValidation, feedModerator);

// exporting routes
module.exports = router;
