/* eslint-disable consistent-return */
const Joi = require('@hapi/joi');

// middlware functions validating inputs with Joi Validation

// payment function
const payment = (req, res, next) => {
  // payment schema
  const paymentSchema = Joi.object().keys({
    userId: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    name: Joi.string().max(50).required(),
    cardName: Joi.string().max(50).required(),
    cardNumber: Joi.string()
      .min(13)
      .max(19)
      .pattern(/^[0-9]+$/)
      .required(),
    expMonth: Joi.string()
      .min(1)
      .max(2)
      .pattern(/^([1-9]|1[012])$/)
      .required(),
    expYear: Joi.string()
      .length(4)
      .pattern(/^[0-9]+$/)
      .required(),
    cvc: Joi.string()
      .length(3)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  try {
    // validating if schema match with req.body
    const result = paymentSchema.validate(req.body);
    if (result.error) {
      // if no, then return the error
      return res.status(422).json(result.error.details[0].message);
    }
    // if yes. then move to the next function
    next();
  } catch (err) {
    // throws an error
    return res.status(500).json('Internal Server Error');
  }
};

// exporting function
module.exports = { payment };
