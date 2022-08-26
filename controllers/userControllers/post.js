/* eslint-disable no-underscore-dangle */
const Post = require('../../models/Post');
const User = require('../../models/User');
const { getIO } = require('../../socket/socket');

// controller functions

// create post function
const uploadPost = async (req, res) => {
  try {
    // CASE HANDLE: if user not found
    const user = await User.findById(req.body.userId);

    // creating new post
    const newPost = new Post({
      userId: req.body.userId,
      userName: user.userName,
      title: req.body.title,
      description: req.body.description,
    });

    // saving it in database
    const { userId, ...uploadedPost } = (await newPost.save())._doc;

    // giving signal to all client who are listingt to socket "newPost"
    getIO().emit('newPost', { newPost: uploadedPost });

    // return success message with post information except owner userID
    return res.status(200).json({ message: 'Post uploaded successfully', post: uploadedPost });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// update post function
const updatePost = async (req, res) => {
  try {
    // CASE HANDLE: if post not found
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json('Post not found');
    }

    // CASE HANDLE: if user is not the owner of post
    if (post.userId === req.body.userId) {
      // updating post
      await post.updateOne({ $set: req.body });

      // giving signal to all client who are listingt to socket "updatedPost"
      getIO().emit('updatedPost', { postID: req.params.id });

      // return success message with postID of updated post
      return res.status(200).json({
        message: 'Post update successfully',
        post: { postId: req.params.id },
      });
    }
    // if user is not owner of post
    return res.status(403).json('You can update only your post');
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

    // CASE HANDLE: if user is not owner of the post
    if (post.userId === req.body.userId) {
      // deleting post
      await post.deleteOne();

      // giving signal to all client who are listingt to socket "deletedPost"
      getIO().emit('deletedPost', { postID: req.params.id });

      // return success message with postID of deletd post
      return res.status(200).json({
        message: 'Post deleted successfully',
        post: { postId: req.params.id },
      });
    }
    // if user is not owner of post
    return res.status(403).json('You can delete only your post');
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

    // fetching information
    const { userId, ...postData } = post._doc;

    // return success message with post information
    return res.status(200).json({ message: 'Post fetched successfully', post: postData });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// exporting fucntions
module.exports = { uploadPost, updatePost, deletePost, getPost };
