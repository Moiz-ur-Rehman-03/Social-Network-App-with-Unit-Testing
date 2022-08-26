/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// controller function

// register user function
const registerUser = async (req, res) => {
  try {
    // generate new hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
    });

    // CASE HANDLE: if userName is not unique
    const userNameExist = await User.findOne({ userName: req.body.userName });

    // CASE HANDLE: if email is not unique
    const userExist = await User.findOne({ email: req.body.email });

    if (userExist || userNameExist) return res.status(409).json('Email or Username is not unique');

    // save user
    const user = await newUser.save();

    // return success message with user information
    res.status(200).json({
      message: 'User registered successfully',
      userData: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
    });
  } catch (err) {
    // catching error
    res.status(500).json('Internal Server Error');
  }
};

// login user function
const loginUser = async (req, res) => {
  try {
    // CASE HANDLE: if user not found
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('401');
    }

    // CASE HANDLE: if password is wrong
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json('email or password is wrong');
    }

    // creating authroization token for user which expire in 12 hour
    const token = jwt.sign({ _id: user._id }, process.env.USER_TOKEN_SECRET, {
      expiresIn: '12h',
    });

    // attaching authorization token to header
    res.header('authToken', token);

    // return success response with userID, userName and authorization token
    res.status(200).json({
      message: 'User logged-in successfully',
      authToken: token,
      user: { userId: user._id, userName: user.userName },
    });
  } catch (err) {
    // catching error
    if (err.message === '401') {
      return res.status(401).json('email or password is wrong');
    }
    return res.status(500).json('Internal Server Error');
  }
};

// exporting functions
module.exports = { loginUser, registerUser };
