const mongoose = require('mongoose');

// Post Schema
const postSchema = new mongoose.Schema({
  // userId of user who is creating the post
  userId: {
    type: String,
    required: true,
  },
  // userName of owner whose length should be minimum 3 and maximum 50
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  // title of Post
  title: {
    type: String,
    required: true,
  },
  // description of Post
  description: {
    type: String,
    required: true,
  },
  // date on which it is created
  date: {
    type: Date,
    default: Date.now,
  },
});

// exporting model
module.exports = mongoose.model('Post', postSchema);
