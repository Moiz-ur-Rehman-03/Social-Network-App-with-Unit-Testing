const router = require('express').Router();
const dotenv = require('dotenv');
const paymentValidation = require('../../middleware/joi_validation/payment').payment;
const { paymentUser } = require('../../controllers/userControllers/payment');

dotenv.config();

// payment route
router.post('/', paymentValidation, paymentUser);

// exporting routes
module.exports = router;
