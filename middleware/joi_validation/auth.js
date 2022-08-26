/* eslint-disable consistent-return */
const Joi = require('@hapi/joi');

// middlware functions validating inputs with Joi Validation

// login function
const login = (req, res, next) => {
  // login schema to whom req.body should match
  const loginSchema = Joi.object().keys({
    email: Joi.string().email().lowercase().max(50).required(),
    password: Joi.string().min(6).required(),
  });

  try {
    // validating loginSchema with req.body
    const result = loginSchema.validate(req.body);
    if (result.error) {
      // if there is error then return it
      return res.status(422).json(result.error.details[0].message);
    }
    // if not then move to next function
    next();
  } catch (err) {
    // return response 500 if unknown issue
    return res.status(500).json('Internal Server Error');
  }
};

// user register function
const userRegister = (req, res, next) => {
  // register schema to whom req.body should match
  const registerSchema = Joi.object().keys({
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50),
    userName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().lowercase().max(50).required(),
    password: Joi.string().min(6).required(),
  });
  try {
    // validating registerSchema with req.body
    const result = registerSchema.validate(req.body);
    if (result.error) {
      // if there is error then return it
      return res.status(422).json(result.error.details[0].message);
    }
    // if not then move to next function
    next();
  } catch (err) {
    // return response 500 if unknown issue
    return res.status(500).json('Internal Server Error');
  }
};

// moderator register function
const moderatorRegister = (req, res, next) => {
  // register schema to whom req.body should match
  const registerSchema = Joi.object().keys({
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50),
    email: Joi.string().email().lowercase().max(50).required(),
    password: Joi.string().min(6).required(),
  });
  try {
    // validating registerSchema with req.body
    const result = registerSchema.validate(req.body);
    if (result.error) {
      // if there is error then return it
      return res.status(422).json(result.error.details[0].message);
    }
    // if not then move to next function
    next();
  } catch (err) {
    // return response 500 if unknown issue
    return res.status(500).json('Internal Server Error');
  }
};

// export function
module.exports = { login, userRegister, moderatorRegister };
