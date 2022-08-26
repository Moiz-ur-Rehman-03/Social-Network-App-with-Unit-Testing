const router = require('express').Router();
const { login: loginValidation, userRegister: registerValidation } = require('../../middleware/joi_validation/auth');
const { loginUser, registerUser } = require('../../controllers/userControllers/auth');

// register user
router.post('/register', registerValidation, registerUser);

// login user
router.get('/login', loginValidation, loginUser);

// exporting routes
module.exports = router;
