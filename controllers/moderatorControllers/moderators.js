/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const Moderator = require('../../models/Moderator');

// controller functions

// update moderator function
const updateModerator = async (req, res) => {
  try {
    // CASE HANDLE : if moderator not found
    const moderator = await Moderator.findById(req.body.moderatorId);

    // if password is present in file then hashed it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    // if email is present in body then check if it is unique
    if (req.body.email) {
      // CASE HANDLE: if email is not unique
      const result = await Moderator.findOne({ email: req.body.email });
      if (result) {
        return res.status(409).json('Email already exists');
      }
    }

    // delete moderatorId from body as it's not part of schema
    delete req.body.moderatorId;

    // updating moderator information
    const { _id, password, ...updatedModerator } = (
      await Moderator.findByIdAndUpdate(
        moderator._id,
        {
          $set: req.body,
        },
        { new: true }
      )
    )._doc;

    // return success message with moderator information except password and moderatorId
    res.status(200).json({
      message: 'Account updated successfully',
      moderator: updatedModerator,
    });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// delete moderator function
const deleteModerator = async (req, res) => {
  try {
    // CASE HANDLE: if moderaotr is not found
    // deleting moderator after finding it by id
    await Moderator.findByIdAndDelete(req.body.moderatorId);

    // return success message with moderatorId which is deleted
    return res.status(200).json({
      message: 'Moderator has been deleted successfully',
      moderatorId: req.body.moderatorId,
    });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// exporting functions
module.exports = { updateModerator, deleteModerator };
