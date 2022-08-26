/* eslint-disable consistent-return */
const Joi = require('@hapi/joi');

// middlware functions validating inputs with Joi Validation

// update user function
const updateUser = (req, res, next) => {
  // update schema
  const updateSchema = Joi.object().keys({
    firstName: Joi.string().max(50),
    lastName: Joi.string().max(50),
    email: Joi.string().email().lowercase().max(50),
    password: Joi.string().min(6),
    userId: Joi.string().required(),
  });
  try {
    // validating if req.body match schema
    const result = updateSchema.validate(req.body);
    if (result.error) {
      // if not, then return error
      return res.status(422).json(result.error.details[0].message);
    }
    // if yes, then move to the next function
    next();
  } catch (err) {
    // throws an error
    return res.status(500).json('Internal Server Error');
  }
};

// user id validating fucntion
const idUser = (req, res, next) => {
  // id schema
  const idSchema = Joi.object().keys({
    userId: Joi.string().required(),
  });
  try {
    // validating if req.body match schema
    const result = idSchema.validate(req.body);
    if (result.error) {
      // if not, then return error
      return res.status(422).json(result.error.details[0].message);
    }
    // if yes, then move to the next function
    next();
  } catch (err) {
    // throws an error
    return res.status(500).json('Internal Server Error');
  }
};

// exporting functions
module.exports = { updateUser, idUser };
