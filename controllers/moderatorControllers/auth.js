/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Moderator = require('../../models/Moderator');

// controller functions

// register moderator
const registerModerator = async (req, res) => {
  try {
    // generate new hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new moderator
    const newModerator = new Moderator({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });

    // CASE HANDLE : if Email already exists
    const moderatorExist = await Moderator.findOne({ email: req.body.email });
    if (moderatorExist) {
      return res.status(409).json('Email already exist');
    }

    // save moderator and respond
    const moderator = await newModerator.save();

    // return sucess message with moderator information
    return res.status(200).json({
      message: 'Moderator registered successfully',
      moderatorData: {
        email: moderator.email,
        firstName: moderator.firstName,
        lastName: moderator.lastName,
      },
    });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// login moderator
const loginModerator = async (req, res) => {
  try {
    // CASE HANDLE : if Moderator not found
    const moderator = await Moderator.findOne({ email: req.body.email });
    if (!moderator) {
      throw new Error('401');
    }

    // CASE HANDLE:  if password is wrong
    const validPassword = await bcrypt.compare(req.body.password, moderator.password);
    if (!validPassword) {
      return res.status(401).json('Email or Password is wrong');
    }

    // creating an authorization token which expire in 12 hours
    const token = jwt.sign({ _id: moderator._id }, process.env.MODERATOR_TOKEN_SECRET, {
      expiresIn: '12h',
    });

    // putting authorization token in header
    res.header('authToken', token);

    // return success message with moderatorId and authorization token
    return res.status(200).json({
      message: 'Moderator logged-in successfully',
      authToken: token,
      moderator: {
        moderatorId: moderator._id,
      },
    });
  } catch (err) {
    // catching an error
    if (err.message === '401') {
      return res.status(401).json('email or password is wrong');
    }
    return res.status(500).json('Internal Server Error');
  }
};

// exporting functions
module.exports = { registerModerator, loginModerator };
