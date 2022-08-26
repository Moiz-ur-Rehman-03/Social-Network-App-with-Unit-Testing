const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  // first name of user which is string with maximum length 50.
  firstName: {
    type: String,
    required: true,
    max: 50,
  },
  // last name of user which is string with maximum length 50.
  lastName: {
    type: String,
    max: 50,
    default: '',
  },
  // userName of user which is string with minimum length 3 and maximum length 50. and should be unique
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
    unique: true,
  },
  // email of user which should be unique
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  // password of user whose length should be atleast 6 character long
  password: {
    type: String,
    required: true,
    min: 6,
  },
  // array of users to whom the user is following
  followings: {
    type: Array,
    default: [],
  },
  // true, if paid the amount and can enjoy Feed of Social Network App
  subscribed: {
    type: Boolean,
    default: false,
  },
  // date on which object is created
  date: {
    type: Date,
    default: Date.now,
  },
});

// exporting model
module.exports = mongoose.model('User', userSchema);
