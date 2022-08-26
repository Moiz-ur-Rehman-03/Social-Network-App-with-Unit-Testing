const router = require('express').Router();
const {
  updateModerator: updateValidation,
  idModerator: moderatorIdValidation,
} = require('../../middleware/joi_validation/moderator');
const { updateModerator, deleteModerator } = require('../../controllers/moderatorControllers/moderators');

// update moderator
router.put('/', updateValidation, updateModerator);

// delete moderator
router.delete('/', moderatorIdValidation, deleteModerator);

// exporting routes
module.exports = router;
