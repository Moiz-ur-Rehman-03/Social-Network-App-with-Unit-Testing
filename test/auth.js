/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Moderator Auth ', () => {
  context('Moderator Register (/moderator/auth/register)', () => {
    const registerInfo = {
      email: 'moiz030@gmail.com',
      password: 'moiz0300',
      firstName: 'Moiz',
      lastName: 'ur Rehman',
    };
    it('(status:200) should return the email, firstName and lastName', async () => {
      const res = await chai.request(server).post('/moderator/auth/register/').send(registerInfo);
      expect(res.status).to.be.equal(200);
      expect(res.body.moderatorData.email).to.be.a('string');
      expect(res.body.moderatorData.firstName).to.be.a('string');
      expect(res.body.moderatorData.lastName).to.be.a('string');
    });
    it('(status:409) should return conflict error (Email is not unique)', async () => {
      const res = await chai.request(server).post('/moderator/auth/register/').send(registerInfo);
      expect(res.status).to.be.equal(409);
    });
    it('(status:422) should return unprocessable entity error (Joi Validation Error)', async () => {
      registerInfo.email = 'moiz03@gmail..com';
      registerInfo.password = '1';
      const res = await chai.request(server).post('/moderator/auth/register/').send(registerInfo);
      expect(res.status).to.be.equal(422);
    });
  });

  context('Moderator Login (/moderator/auth/login)', () => {
    const loginInfo = {
      email: 'moiz030@gmail.com',
      password: 'moiz0300',
    };
    it('(status:200) should return the moderatorId and authToken', async () => {
      const res = await chai.request(server).get('/moderator/auth/login').send(loginInfo);
      expect(res.status).to.be.equal(200);
      expect(res.body.moderator.moderatorId).to.be.a('string');
      expect(res.header.authtoken).to.be.a('string');
    });
    it('(status:401) should return unauthorized error (Wrong Password)', async () => {
      loginInfo.password = 'moiz030';
      const res = await chai.request(server).get('/moderator/auth/login').send(loginInfo);
      expect(res.status).to.be.equal(401);
    });
    it('(status:401) should return unauthorized error (Wrong Email)', async () => {
      loginInfo.email = 'moiz03@gmail.com';
      const res = await chai.request(server).get('/moderator/auth/login').send(loginInfo);
      expect(res.status).to.be.equal(401);
    });
    it('(status:422) should return unprocessable entity error (Joi Validation Error)', async () => {
      loginInfo.email = 'moiz03@gmail..com';
      loginInfo.password = '1';
      const res = await chai.request(server).get('/moderator/auth/login').send(loginInfo);
      expect(res.status).to.be.equal(422);
    });
  });
});

describe('User Auth ', () => {
  context('User Register (/auth/register)', () => {
    const registerInfo = {
      email: 'moiz030@gmail.com',
      password: 'moiz0300',
      firstName: 'Moiz',
      lastName: 'ur Rehman',
      userName: 'moiz3',
    };
    it('(status:200) should return the email, userName, firstName and lastName', async () => {
      const res = await chai.request(server).post('/auth/register/').send(registerInfo);
      expect(res.status).to.be.equal(200);
      expect(res.body.userData.email).to.be.a('string');
      expect(res.body.userData.userName).to.be.a('string');
      expect(res.body.userData.firstName).to.be.a('string');
      expect(res.body.userData.lastName).to.be.a('string');
    });
    it('(status:409) should return conflict error (Email or Username is not unique)', async () => {
      const res = await chai.request(server).post('/auth/register/').send(registerInfo);
      expect(res.status).to.be.equal(409);
    });
    it('(status:422) should return unprocessable entity error (Joi Validation Error)', async () => {
      registerInfo.email = 'moiz03@gmail..com';
      registerInfo.password = '1';
      const res = await chai.request(server).post('/auth/register/').send(registerInfo);
      expect(res.status).to.be.equal(422);
    });
  });

  context('User Login (/auth/login)', () => {
    const loginInfo = {
      email: 'moiz030@gmail.com',
      password: 'moiz0300',
    };
    it('(status:200) should return the userId and authToken', async () => {
      const res = await chai.request(server).get('/auth/login').send(loginInfo);
      expect(res.status).to.be.equal(200);
      expect(res.body.user.userId).to.be.a('string');
      expect(res.header.authtoken).to.be.a('string');
    });
    it('(status:401) should return unauthorized error (Wrong Password)', async () => {
      loginInfo.password = 'moiz030';
      const res = await chai.request(server).get('/auth/login').send(loginInfo);
      expect(res.status).to.be.equal(401);
    });
    it('(status:401) should return unauthorized error (Wrong Email)', async () => {
      loginInfo.email = 'moiz03@gmail.com';
      const res = await chai.request(server).get('/auth/login').send(loginInfo);
      expect(res.status).to.be.equal(401);
    });
    it('(status:422) should return unprocessable entity error (Joi Validation Error)', async () => {
      loginInfo.email = 'moiz03@gmail..com';
      loginInfo.password = '1';
      const res = await chai.request(server).get('/auth/login/').send(loginInfo);
      expect(res.status).to.be.equal(422);
    });
  });
});
