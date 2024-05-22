const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');
const { User } = require('../../models/index');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  let chai;
  let expect;

  before(async () => {
    chai = await import('chai');
    expect = chai.expect;
  });

  let findOneStub;
  let createStub;

  beforeEach(() => {
    findOneStub = sinon.stub(User, 'findOne');
    createStub = sinon.stub(User, 'create');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 200 for successful login', async () => {
    const hashedPassword = await bcrypt.hash('validPassword', 10);
    findOneStub.resolves({
      UserID: 1,
      Username: 'validUser',
      Password: hashedPassword
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ Username: 'validUser', Password: 'validPassword' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });

  it('should return 201 for successful registration', async () => {
    findOneStub.resolves(null);
    createStub.resolves({
      UserID: 1,
      Username: 'newUser',
      Email: 'newuser@example.com',
      FirstName: 'First',
      LastName: 'Last',
      Role: 'student'
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        Username: 'newUser',
        Email: 'newuser@example.com',
        FirstName: 'First',
        LastName: 'Last',
        Password: 'newpassword',
        Role: 'student'
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('user');
  });

  // More tests for auth routes
});
