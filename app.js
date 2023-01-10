// external imports
const express = require('express');

const app = express();
const dotenv = require('dotenv');

// internal imports

// user and moderator routes for their information changing and deletion
const usersRoute = require('./routes/userRoutes/user');
const moderatorRoute = require('./routes/moderatorRoutes/moderator');

// user and moderator routes for login and register
const authRoute = require('./routes/userRoutes/auth');
const authRouteModerator = require('./routes/moderatorRoutes/auth');

// user and moderator routes for accessing posts
const postsRoute = require('./routes/userRoutes/post');
const postsRouteModerator = require('./routes/moderatorRoutes/post');

// payment route for user to pay for Feed
const paymentRoute = require('./routes/userRoutes/payment');

// user and moderator routes for accessing Feed
const userFeedRoute = require('./routes/userRoutes/feed');
const moderatorFeedRoute = require('./routes/moderatorRoutes/feed');

// middleware token import to verify user and moderator are logged in and have authorization token
const { userTokenVerify, moderatorTokenVerify } = require('./middleware/tokenVerification');

// to intialize the socket
const { init } = require('./socket/socket');

// mongoDb connection
const mongoDB = require('./connection');

// to access .env variables
dotenv.config();

// making connection with MongoDB
mongoDB();

// middleware
app.use(express.json());

// user and moderator routes for login and register
app.use('/auth', authRoute);
app.use('/moderator/auth', authRouteModerator);

// user and moderator routes for their information changing and deletion
app.use('/user', userTokenVerify, usersRoute);
app.use('/moderator', moderatorTokenVerify, moderatorRoute);

// user and moderator routes for accessing posts
app.use('/post', userTokenVerify, postsRoute);
app.use('/moderator/post', moderatorTokenVerify, postsRouteModerator);

// payment route for user to pay for Feed
app.use('/payment', userTokenVerify, paymentRoute);

// user and moderator routes for accessing Feed
app.use('/feed', userTokenVerify, userFeedRoute);
app.use('/moderator/feed', moderatorTokenVerify, moderatorFeedRoute);

// welcome route to Social Network
app.get('/', (req, res) => {
  res.status(200).json('Welcome to Social Network App by Moiz ur Rehman');
});

// all invalid routes
app.get('*', (req, res) => res.status(404).json('Page not found'));

// starting app
const server = app.listen(process.env.PORT, () => {
  console.log('Backend server is running!');

  // if server is running then, initalize server
  const io = init(server);
  io.on('connection', () => {
    // on connection with client
    console.log(`Client # ${io.engine.clientsCount} is connected`);
  });
});
module.exports = app;
