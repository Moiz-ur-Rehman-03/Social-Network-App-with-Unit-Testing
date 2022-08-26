const router = require('express').Router();

const {
  login: loginValidation,
  moderatorRegister: registerValidation,
} = require('../../middleware/joi_validation/auth');

const { registerModerator, loginModerator } = require('../../controllers/moderatorControllers/auth');

// register moderator
router.post('/register', registerValidation, registerModerator);

// login moderator
router.get('/login', loginValidation, loginModerator);

// exporting routes
module.exports = router;
