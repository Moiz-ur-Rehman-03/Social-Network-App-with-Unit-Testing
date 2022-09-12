/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { before, describe } = require('mocha');
const server = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

let userId;
let userAuthToken;
let moderatorId;
let moderatorAuthToken;
let postId;

describe('Post Route for User', () => {
  before(async () => {
    // logged in as user
    const loginInfo = { email: 'moiz030@gmail.com', password: 'moiz0300' };
    const data = await chai.request(server).get('/auth/login').send(loginInfo);

    // storing userId and authToken for token verification and to use routes
    userId = data.body.user.userId;
    userAuthToken = data.header.authtoken;
  });

  context('Upload Post (/post)', () => {
    const postInfo = {
      userId,
      title: 'Post Testing 2',
      description: 'Description Testing 2',
    };
    it('(status:200) should return new post information', async () => {
      postInfo.userId = userId;
      const res = await chai.request(server).post('/post').set('authToken', userAuthToken).send(postInfo);
      expect(res.status).to.be.equal(200);
      expect(res.body.post._id).to.be.a('string');

      // saving post id to user it in testing as param
      postId = res.body.post._id;
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).post('/post').set('authToken', userAuthToken).send(userId);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Get Post (/post/:postId)', () => {
    it('(status:200) should return post information', async () => {
      const res = await chai.request(server).get(`/post/${postId}`).set('authToken', userAuthToken).send({ userId });
      expect(res.status).to.be.equal(200);
      expect(res.body.post._id).to.be.a('string');
    });
    it('(status:404) should return not found error (requested post not found)', async () => {
      const res = await chai
        .request(server)
        .get('/post/62f9e643040fcef62a1398b3')
        .set('authToken', userAuthToken)
        .send({ userId });
      expect(res.status).to.be.equal(404);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).get(`/post/${postId}`).set('authToken', userAuthToken).send(null);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Update Post (/post/:postId)', async () => {
    it('(status:200) should return updated post id', async () => {
      const res = await chai
        .request(server)
        .put(`/post/${postId}`)
        .set('authToken', userAuthToken)
        .send({ userId, title: 'Change ' });
      expect(res.status).to.be.equal(200);
      expect(res.body.post.postId).to.be.a('string');
    });
    it('(status:404) should return not found error (requested post not found)', async () => {
      const res = await chai
        .request(server)
        .put('/post/62f9e643040fcef62a1398b3')
        .set('authToken', userAuthToken)
        .send({ userId });
      expect(res.status).to.be.equal(404);
    });
    it('(status:403) should return forbidden error (not the owner of post)', async () => {
      const res = await chai
        .request(server)
        .put(`/post/${postId}`)
        .set('authToken', userAuthToken)
        .send({ userId: '62f64f33dae903f5117887f8' });
      expect(res.status).to.be.equal(403);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).put(`/post/${postId}`).set('authToken', userAuthToken).send(null);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Delete Post (/post/:postId)', async () => {
    it('(status:404) should return not found error (requested post not found)', async () => {
      const res = await chai
        .request(server)
        .delete('/post/62f9e643040fcef62a1398b3')
        .set('authToken', userAuthToken)
        .send({ userId });
      expect(res.status).to.be.equal(404);
    });
    it('(status:403) should return forbidden error (not the owner of post)', async () => {
      const res = await chai
        .request(server)
        .delete(`/post/${postId}`)
        .set('authToken', userAuthToken)
        .send({ userId: '62f64f33dae903f5117887f8' });
      expect(res.status).to.be.equal(403);
    });
    it('(status:200) should return deleted post id', async () => {
      const res = await chai.request(server).delete(`/post/${postId}`).set('authToken', userAuthToken).send({ userId });
      expect(res.status).to.be.equal(200);
      expect(res.body.post.postId).to.be.a('string');
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).delete(`/post/${postId}`).set('authToken', userAuthToken).send(null);
      expect(res.status).to.be.equal(422);
    });
  });
});

describe('Post Route for Moderator', () => {
  before(async () => {
    // creating a new moderator
    const registerInfo = {
      email: 'maaz030@gmail.com',
      password: 'maaz0300',
      firstName: 'Mazz',
      lastName: 'ur Rehman',
    };
    const loginInfo = { email: 'maaz030@gmail.com', password: 'maaz0300' };
    // register a new moderator
    await chai.request(server).post('/moderator/auth/register').send(registerInfo);
    // logged in as new moderator
    const data = await chai.request(server).get('/moderator/auth/login').send(loginInfo);

    // storing moderatorID and authToken for token verification and to use routes
    moderatorId = data.body.moderator.moderatorId;
    moderatorAuthToken = data.header.authtoken;

    // logged in as user to create a post because moderator cannot upload a post
    const userData = await chai
      .request(server)
      .get('/auth/login')
      .send({ email: 'moiz030@gmail.com', password: 'moiz0300' });

    const postInfo = {
      userId: userData.body.user.userId,
      title: 'Post Testing 2',
      description: 'Description Testing 2',
    };

    // creating a new post
    const res = await chai.request(server).post('/post').set('authToken', userData.header.authtoken).send(postInfo);

    // saving post id to user it in testing as param
    postId = res.body.post._id;
  });

  context('Get Post (/moderator/post/:postId)', () => {
    it('(status:200) should return post information', async () => {
      const res = await chai
        .request(server)
        .get(`/moderator/post/${postId}`)
        .set('authToken', moderatorAuthToken)
        .send({ moderatorId });
      expect(res.status).to.be.equal(200);
      expect(res.body.post._id).to.be.a('string');
    });
    it('(status:404) should return not found error (requested post not found)', async () => {
      const res = await chai
        .request(server)
        .get('/moderator/post/62f9e643040fcef62a1398b3')
        .set('authToken', moderatorAuthToken)
        .send({ moderatorId });
      expect(res.status).to.be.equal(404);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai
        .request(server)
        .get(`/moderator/post/${postId}`)
        .set('authToken', moderatorAuthToken)
        .send(null);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Update Post (/moderator/post/:postId)', async () => {
    it('(status:200) should return updated post id', async () => {
      const res = await chai
        .request(server)
        .put(`/moderator/post/${postId}`)
        .set('authToken', moderatorAuthToken)
        .send({ moderatorId, title: 'Change ' });
      expect(res.status).to.be.equal(200);
      expect(res.body.postId).to.be.a('string');
    });
    it('(status:404) should return not found error (requested post not found)', async () => {
      const res = await chai
        .request(server)
        .put('/moderator/post/62f9e643040fcef62a1398b3')
        .set('authToken', moderatorAuthToken)
        .send({ moderatorId });
      expect(res.status).to.be.equal(404);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai
        .request(server)
        .put(`/moderator/post/${postId}`)
        .set('authToken', moderatorAuthToken)
        .send(null);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Delete Post (/moderator/post/:postId)', async () => {
    it('(status:404) should return not found error (requested post not found)', async () => {
      const res = await chai
        .request(server)
        .delete('/moderator/post/62f9e643040fcef62a1398b3')
        .set('authToken', moderatorAuthToken)
        .send({ moderatorId });
      expect(res.status).to.be.equal(404);
    });

    it('(status:200) should return deleted post id', async () => {
      const res = await chai
        .request(server)
        .delete(`/moderator/post/${postId}`)
        .set('authToken', moderatorAuthToken)
        .send({ moderatorId });
      expect(res.status).to.be.equal(200);
      expect(res.body.postId).to.be.a('string');
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai
        .request(server)
        .delete(`/moderator/post/${postId}`)
        .set('authToken', moderatorAuthToken)
        .send(null);
      expect(res.status).to.be.equal(422);
    });
  });
});
