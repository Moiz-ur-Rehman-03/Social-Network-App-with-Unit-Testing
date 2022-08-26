/* eslint-disable consistent-return */
const Joi = require('@hapi/joi');

// middlware functions validating inputs with Joi Validation

// upload post function
const uploadPost = (req, res, next) => {
  // upload post schema
  const uploadSchema = Joi.object().keys({
    userId: Joi.string().trim().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  });
  try {
    // validating if req.body matching with schema
    const result = uploadSchema.validate(req.body);
    if (result.error) {
      // if not, then return the error
      return res.status(422).json(result.error.details[0].message);
    }
    // if yes, then move to the next function
    next();
  } catch (err) {
    // throws an error
    return res.status(500).json('Internal Server Error');
  }
};

// update post function
const updatePost = (req, res, next) => {
  // update post schema
  const updateSchema = Joi.object().keys({
    userId: Joi.string().trim().required(),
    title: Joi.string(),
    description: Joi.string(),
  });
  try {
    // checking if req.body is matching with schema
    const result = updateSchema.validate(req.body);
    if (result.error) {
      // if not, then return the error
      return res.status(422).json(result.error.details[0].message);
    }
    // if yes, then move to the next function
    next();
  } catch (err) {
    // throws an error
    return res.status(500).json('Internal Server Error');
  }
};

// update post by moderator
const updatePostModerator = (req, res, next) => {
  // update post schema
  const updateSchema = Joi.object().keys({
    moderatorId: Joi.string().trim().required(),
    title: Joi.string(),
    description: Joi.string(),
  });
  try {
    // checking if req.body is matching with schema
    const result = updateSchema.validate(req.body);
    if (result.error) {
      // if not, then return the error
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
module.exports = { uploadPost, updatePost, updatePostModerator };
