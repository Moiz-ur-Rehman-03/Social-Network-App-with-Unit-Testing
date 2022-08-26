/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { before, describe } = require('mocha');
const server = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

let userId;
let userAuthToken;

describe('User Route', () => {
  before(async () => {
    // creating a new user
    const registerInfo = {
      email: 'maaz030@gmail.com',
      password: 'maaz0300',
      firstName: 'Mazz',
      lastName: 'ur Rehman',
      userName: 'maaz03',
    };
    const loginInfo = { email: 'maaz030@gmail.com', password: 'maaz0300' };
    // register a new user
    await chai.request(server).post('/auth/register').send(registerInfo);
    // then logged in as new user
    const data = await chai.request(server).get('/auth/login').send(loginInfo);

    // storing userId and authToken for token verification and to use routes
    userId = data.body.user.userId;
    userAuthToken = data.header.authtoken;
  });

  context('Get User (/user/:userName)', () => {
    it('(status:200) should return firstName, lastName, email and userName', async () => {
      const res = await chai.request(server).get('/user/moiz3').set('authToken', userAuthToken).send();
      expect(res.status).to.be.equal(200);
      expect(res.body.user.email).to.be.a('string');
      expect(res.body.user.userName).to.be.a('string');
      expect(res.body.user.firstName).to.be.a('string');
      expect(res.body.user.lastName).to.be.a('string');
    });
    it('(status:404) should return not found error (requested user not found)', async () => {
      const res = await chai.request(server).get('/user/moiz31').set('authToken', userAuthToken).send();
      expect(res.status).to.be.equal(404);
    });
  });

  context('Follow User (/user/:userName/follow)', () => {
    it('(status:200) should return users userName and userName to whom following', async () => {
      const res = await chai.request(server).put('/user/moiz3/follow').set('authToken', userAuthToken).send({ userId });
      expect(res.status).to.be.equal(200);
      expect(res.body.data.userName).to.be.a('string');
      expect(res.body.data.following_to).to.be.a('string');
    });
    it('(status:400) should return bad request error (requested user not found or already following or trying to follow itself)', async () => {
      const res = await chai
        .request(server)
        .put('/user/moiz03/follow')
        .set('authToken', userAuthToken)
        .send({ userId });
      expect(res.status).to.be.equal(400);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).put('/user/moiz3/follow').set('authToken', userAuthToken).send(userId);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Unfollow User (/user/:userName/unfollow)', () => {
    it('(status:200) should return users userName and userName to whom unfollowing', async () => {
      const res = await chai
        .request(server)
        .put('/user/moiz3/unfollow')
        .set('authToken', userAuthToken)
        .send({ userId });
      expect(res.status).to.be.equal(200);
      expect(res.body.data.userName).to.be.a('string');
      expect(res.body.data.unfollowing_to).to.be.a('string');
    });
    it('(status:400) should return bad request error (requested user not found or already not following or trying to unfollow itself)', async () => {
      const res = await chai
        .request(server)
        .put('/user/moiz3/unfollow')
        .set('authToken', userAuthToken)
        .send({ userId });
      expect(res.status).to.be.equal(400);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).put('/user/moiz3/unfollow').set('authToken', userAuthToken).send(userId);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Update User (/user)', async () => {
    const updatedUser = {
      userId,
      email: 'maaz03@gmail.com',
      password: 'maaz03',
    };
    it('(status:200) should return updated user information', async () => {
      updatedUser.userId = userId;
      const res = await chai.request(server).put('/user/').set('authToken', userAuthToken).send(updatedUser);
      expect(res.status).to.be.equal(200);
      expect(res.body.user.email).to.be.a('string');
      expect(res.body.user.userName).to.be.a('string');
      expect(res.body.user.firstName).to.be.a('string');
      expect(res.body.user.lastName).to.be.a('string');
    });
    it('(status:409) should return conflict error (email is not unique)', async () => {
      updatedUser.email = 'moiz030@gmail.com';
      const res = await chai.request(server).put('/user/').set('authToken', userAuthToken).send(updatedUser);
      expect(res.status).to.be.equal(409);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).put('/user/').set('authToken', userAuthToken).send(updatedUser.email);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Delete User (/user)', () => {
    it('(status:200) should return the deleted userId', async () => {
      const res = await chai.request(server).delete('/user').set('authToken', userAuthToken).send({ userId });
      expect(res.status).to.be.equal(200);
      expect(res.body.userId).to.be.a('string');
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).delete('/user').set('authToken', userAuthToken).send(userId);
      expect(res.status).to.be.equal(422);
    });
  });
});
