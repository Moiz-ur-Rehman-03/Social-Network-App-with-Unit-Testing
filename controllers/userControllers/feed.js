const Post = require('../../models/Post');
const User = require('../../models/User');

// controller functions

// user feed fucntion
const feedUser = async (req, res) => {
  try {
    // checking query params, if not present then assigning default values
    const page = parseInt(req.query.page, 10) - 1 || 0;
    const limit = parseInt(req.query.limit, 10) || 5;
    const sortBy = req.query.sort || 'date';
    const sortQuery = {};
    sortQuery[sortBy] = sortBy === 'date' ? -1 : 1;

    // CASE HANDLE: if user not found
    const user = await User.findById(req.body.userId);

    // CASE HANDLE: if user is not paid yet for Feed
    if (!user.subscribed) {
      return res.status(401).json('You have to pay for the content');
    }

    // fetching posts of users to whom user is following according to query params
    const posts = await Post.find()
      .where('userName')
      .in([user.userName, ...user.followings])
      .select('-userId')
      .sort(sortQuery)
      .skip(page * limit)
      .limit(limit);

    // return success message, query params and posts infromation
    return res.status(200).json({
      message: 'All posts are fetched successfully',
      params: { page, limit, sortBy },
      allPosts: posts,
    });
  } catch (err) {
    // catching error
    return res.status(500).json('Internal Server Error');
  }
};

// exporting function
module.exports = { feedUser };
