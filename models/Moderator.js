const mongoose = require('mongoose');

// Moderator Schemma
const moderatorSchema = new mongoose.Schema({
  // first name of moderator which is string with maximum length 50.
  firstName: {
    type: String,
    required: true,
    max: 50,
  },
  // last name of moderator which is string with maximum length 50.
  lastName: {
    type: String,
    max: 50,
  },
  // email of moderator which should be unique
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  // password of moderator whose length should be atleast 6 character long
  password: {
    type: String,
    required: true,
    min: 6,
  },
  // date on which object is created
  date: {
    type: Date,
    default: Date.now,
  },
});

// exporting model
module.exports = mongoose.model('Moderator', moderatorSchema);
