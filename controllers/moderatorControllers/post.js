/* eslint-disable no-underscore-dangle */
const Post = require('../../models/Post');
const { getIO } = require('../../socket/socket');

// controller functions

// update post function
const updatePost = async (req, res) => {
  try {
    // CASE HANDLE: if post not found
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json('Post not found');
    }

    // deleting moderatorID from req.body as it's not part of schema
    delete req.body.moderatorId;

    // updating post
    await post.updateOne({ $set: req.body });

    // giving signal to every client who is listening on socket "updatedPost"
    getIO().emit('updatedPost', { postID: req.params.id });

    // return success message with postId which is updated
    return res.status(200).json({ message: 'Post update successfully', postId: req.params.id });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// delete post function
const deletePost = async (req, res) => {
  try {
    // CASE HANDLE: if post not found
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json('Post not found');
    }

    // deleting post
    await post.deleteOne();

    // giving signal to every client who is listening on socket "deletedPost"
    getIO().emit('deletedPost', { postId: req.params.id });

    // return success message with postId of deleted post
    return res.status(200).json({ message: 'Post deleted successfully', postId: req.params.id });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// get post function
const getPost = async (req, res) => {
  try {
    // CASE HANDLE: if post not found
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json('Post not found');
    }

    // fetching post data except username and userid of owner
    const { userId, userName, ...postData } = post._doc;

    // return success message with post data
    return res.status(200).json({ message: 'Post fetched successfully', post: postData });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// exporting functions
module.exports = { updatePost, deletePost, getPost };
