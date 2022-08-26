/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { before, describe } = require('mocha');
const server = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

let userId;
let userAuthToken;

describe('Payment Route', () => {
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
    // logged in as new user
    const data = await chai.request(server).get('/auth/login').send(loginInfo);

    // storing userId and authToken for token verification and to use routes
    userId = data.body.user.userId;
    userAuthToken = data.header.authtoken;
  });

  context('Payment by User (/payment)', () => {
    const paymentInfo = {
      email: 'moiz030@gmial.com',
      name: 'Moiz ur Rehman',
      cardName: 'Moiz Rehman',
      cardNumber: '4000000000009995',
      expMonth: '10',
      expYear: '2025',
      cvc: '222',
      userId,
    };
    it('(status:402) should return payment required error (payment failed)', async () => {
      paymentInfo.userId = userId;
      const res = await chai.request(server).post('/payment').set('authToken', userAuthToken).send(paymentInfo);
      expect(res.status).to.be.equal(402);
    });
    it('(status:200) should return userName of user who paid', async () => {
      paymentInfo.cardNumber = '4242424242424242';
      const res = await chai.request(server).post('/payment').set('authToken', userAuthToken).send(paymentInfo);
      expect(res.status).to.be.equal(200);
      expect(res.body.user.userName).to.be.a('string');
    });
    it('(status:409) should return conflict error (already paid)', async () => {
      const res = await chai.request(server).post('/payment').set('authToken', userAuthToken).send(paymentInfo);
      expect(res.status).to.be.equal(409);
    });
    it('(status:422) should return unprocessible entity error (Joi Validation)', async () => {
      const res = await chai.request(server).post('/payment').set('authToken', userAuthToken).send(userId);
      expect(res.status).to.be.equal(422);
    });
  });
});
