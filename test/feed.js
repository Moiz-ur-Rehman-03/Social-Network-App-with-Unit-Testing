/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { before, describe } = require('mocha');
const server = require('../app');

const Post = require('../models/Post');
const User = require('../models/User');
const Moderator = require('../models/Moderator');

chai.use(chaiHttp);
const { expect } = chai;

let userId;
let userAuthToken;
let userIdNotPaid;
let moderatorId;
let moderatorAuthToken;

describe('Feed Route for User', () => {
  before(async () => {
    // logged in as a user
    const loginInfo = { email: 'moiz030@gmail.com', password: 'moiz0300' };
    const data = await chai.request(server).get('/auth/login').send(loginInfo);

    // storing userId and authToken for token verification and to use routes
    userId = data.body.user.userId;
    userAuthToken = data.header.authtoken;
    userIdNotPaid = data.body.user.userId;

    const postInfo = {
      userId,
      title: 'Post Testing 2',
      description: 'Description Testing 2',
    };
    // creating a post with logged in user
    await chai.request(server).post('/post').set('authToken', userAuthToken).send(postInfo);

    // logged in as differnet user
    loginInfo.email = 'maaz030@gmail.com';
    loginInfo.password = 'maaz0300';
    const newData = await chai.request(server).get('/auth/login').send(loginInfo);

    // storing userId and authToken for token verification and to use routes
    userId = newData.body.user.userId;
    userAuthToken = newData.header.authtoken;

    // following a user so can check his posts on feed
    await chai.request(server).put('/user/moiz3/follow').set('authToken', userAuthToken).send({ userId });
  });

  context('Get Feed (/feed)', () => {
    it('(status:200) should return post information', async () => {
      const res = await chai.request(server).get('/feed').set('authToken', userAuthToken).send({ userId });
      expect(res.status).to.be.equal(200);
    });
    it('(status:401) should return not authorized error (user not paid for the feed)', async () => {
      const res = await chai
        .request(server)
        .get('/feed')
        .set('authToken', userAuthToken)
        .send({ userId: userIdNotPaid });
      expect(res.status).to.be.equal(401);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).get('/feed').set('authToken', userAuthToken).send(null);
      expect(res.status).to.be.equal(422);
    });
  });
});

describe('Feed Route for Moderator', () => {
  before(async () => {
    // logged in as moderator
    const loginInfo = { email: 'maaz030@gmail.com', password: 'maaz0300' };
    const data = await chai.request(server).get('/moderator/auth/login').send(loginInfo);

    // storing moderatorId and authToken for token verification and to use routes
    moderatorId = data.body.moderator.moderatorId;
    moderatorAuthToken = data.header.authtoken;
  });

  after(async () => {
    // deleteing whole database created for testing
    await User.deleteMany();
    await Post.deleteMany();
    await Moderator.deleteMany();
  });

  context('Get Feed (/moderator/feed)', () => {
    it('(status:200) should return post information', async () => {
      const res = await chai
        .request(server)
        .get('/moderator/feed')
        .set('authToken', moderatorAuthToken)
        .send({ moderatorId });
      expect(res.status).to.be.equal(200);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).get('/moderator/feed').set('authToken', moderatorAuthToken).send(null);
      expect(res.status).to.be.equal(422);
    });
  });
});
