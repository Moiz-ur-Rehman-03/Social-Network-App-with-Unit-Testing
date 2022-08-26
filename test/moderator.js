/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { before, describe } = require('mocha');
const server = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

let moderatorId;
let moderatorAuthToken;

describe('Moderator Route', () => {
  before(async () => {
    // creating a new moderator
    const registerInfo = {
      email: 'maaz030@gmail.com',
      password: 'maaz0300',
      firstName: 'Mazz',
      lastName: 'ur Rehman',
    };
    const loginInfo = { email: 'maaz030@gmail.com', password: 'maaz0300' };
    // registering a new moderator
    await chai.request(server).post('/moderator/auth/register').send(registerInfo);
    // logged in as new moderator
    const data = await chai.request(server).get('/moderator/auth/login').send(loginInfo);
    // storing moderatorId and authToken for token verification and to use routes
    moderatorId = data.body.moderator.moderatorId;
    moderatorAuthToken = data.header.authtoken;
  });

  context('Update Moderator (/moderator)', async () => {
    const updatedModerator = {
      moderatorId,
      email: 'maaz03@gmail.com',
      password: 'maaz03',
    };
    it('(status:200) should return updated moderator information', async () => {
      updatedModerator.moderatorId = moderatorId;
      const res = await chai
        .request(server)
        .put('/moderator/')
        .set('authToken', moderatorAuthToken)
        .send(updatedModerator);
      expect(res.status).to.be.equal(200);
      expect(res.body.moderator.email).to.be.a('string');
      expect(res.body.moderator.firstName).to.be.a('string');
      expect(res.body.moderator.lastName).to.be.a('string');
    });
    it('(status:409) should return conflict error (email is not unique)', async () => {
      updatedModerator.email = 'moiz030@gmail.com';

      const res = await chai
        .request(server)
        .put('/moderator/')
        .set('authToken', moderatorAuthToken)
        .send(updatedModerator);
      expect(res.status).to.be.equal(409);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai
        .request(server)
        .put('/moderator/')
        .set('authToken', moderatorAuthToken)
        .send(updatedModerator.email);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Delete Moderator (/moderator)', () => {
    it('(status:200) should return the deleted moderatorId', async () => {
      const res = await chai
        .request(server)
        .delete('/moderator')
        .set('authToken', moderatorAuthToken)
        .send({ moderatorId });
      expect(res.status).to.be.equal(200);
      expect(res.body.moderatorId).to.be.a('string');
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai
        .request(server)
        .delete('/moderator')
        .set('authToken', moderatorAuthToken)
        .send(moderatorId);
      expect(res.status).to.be.equal(422);
    });
  });
});
