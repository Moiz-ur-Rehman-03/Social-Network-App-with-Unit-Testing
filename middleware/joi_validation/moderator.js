/* eslint-disable consistent-return */
const Joi = require('@hapi/joi');

// middlware functions validating inputs with Joi Validation

// update moderator function
const updateModerator = (req, res, next) => {
  // update schema
  const updateSchema = Joi.object().keys({
    firstName: Joi.string().max(50),
    lastName: Joi.string().max(50),
    email: Joi.string().email().lowercase().max(50),
    password: Joi.string().min(6),
    moderatorId: Joi.string().required(),
  });
  try {
    // validating if req.body match with schemma
    const result = updateSchema.validate(req.body);
    if (result.error) {
      // if no, then return an error
      return res.status(422).json(result.error.details[0].message);
    }
    // if yes, then move to next function
    next();
  } catch (err) {
    // catch an error
    return res.status(500).json('Internal Server Error');
  }
};

// moderator id validating function
const idModerator = (req, res, next) => {
  // id schema
  const idSchema = Joi.object().keys({
    moderatorId: Joi.string().required(),
  });
  try {
    // validating if req.body match with schemma
    const result = idSchema.validate(req.body);
    if (result.error) {
      // if no, then return an error
      return res.status(422).json(result.error.details[0].message);
    }
    // if yes, then move to next function
    next();
  } catch (err) {
    // catch an error
    return res.status(500).json('Internal Server Error');
  }
};

// exporting functions
module.exports = { updateModerator, idModerator };
