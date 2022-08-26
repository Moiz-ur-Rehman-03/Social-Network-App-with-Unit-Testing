/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

// middleware function which is verifying if User have authorization to use Social Network App
const userTokenVerify = (req, res, next) => {
  // fetching token from body or header
  const token = req.body.authToken || req.header('authToken');

  // if token not available then response with 401 http status
  if (!token) return res.status(401).json('provide Authorization Token');

  try {
    // verifying if giving authorization token is correct or not.
    const verified = jwt.verify(token, process.env.USER_TOKEN_SECRET);
    req.user = verified;

    // if correct, then move to next function
    next();
  } catch (err) {
    // if not correct, then return the 'invalid token' response
    res.status(400).json('Invalid Token');
  }
};

// middleware function which is verifying if Moderator have authorization to use Social Network App
const moderatorTokenVerify = (req, res, next) => {
  // fetching token from body or header
  const token = req.body.authToken || req.header('authToken');

  // if token not available then response with 401 http status
  if (!token) return res.status(401).json('provide Authorization Token');

  try {
    // verifying if giving authorization token is correct or not.
    const verified = jwt.verify(token, process.env.MODERATOR_TOKEN_SECRET);
    req.moderator = verified;

    // if correct, then move to next function
    next();
  } catch (err) {
    // if not correct, then return the 'invalid token' response
    res.status(400).json('Invalid Token');
  }
};

// exporting middleware functions
module.exports = { userTokenVerify, moderatorTokenVerify };
