const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models/index');
const { login, register } = require('../../controllers/AuthController');

describe('AuthController', () => {
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

  describe('login', () => {
    it('should return 200 and token if credentials are valid', async () => {
      const req = {
        body: {
          Username: 'validUser',
          Password: 'validPassword'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      const hashedPassword = await bcrypt.hash('validPassword', 10);
      findOneStub.resolves({
        UserID: 1,
        Username: 'validUser',
        Password: hashedPassword
      });

      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('token');

      await login(req, res);

      // Debugging output
      console.log('res.status:', res.status.calledWith(200));
      console.log('res.json:', res.json.calledWithMatch({ token: 'token' }));

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ token: 'token' })).to.be.true;

      bcrypt.compare.restore();
      jwt.sign.restore();
    });

    it('should return 400 if credentials are invalid', async () => {
      const req = {
        body: {
          Username: 'invalidUser',
          Password: 'invalidPassword'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      findOneStub.resolves(null);

      await login(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'User not found' })).to.be.true;
    });

    // More tests for login
  });

  describe('register', () => {
    it('should return 201 and user if registration is successful', async () => {
      const req = {
        body: {
          Username: 'newUser',
          Email: 'newuser@example.com',
          FirstName: 'First',
          LastName: 'Last',
          Password: 'newpassword',
          Role: 'student'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      findOneStub.resolves(null);
      createStub.resolves({
        UserID: 1,
        Username: 'newUser',
        Email: 'newuser@example.com',
        FirstName: 'First',
        LastName: 'Last',
        Role: 'student'
      });

      await register(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ user: { Username: 'newUser' } })).to.be.true;
    });

    it('should return 400 if user already exists', async () => {
      const req = {
        body: {
          Username: 'existingUser',
          Email: 'existing@example.com',
          FirstName: 'First',
          LastName: 'Last',
          Password: 'password',
          Role: 'student'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      findOneStub.resolves({
        UserID: 1,
        Username: 'existingUser',
        Email: 'existing@example.com'
      });

      await register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'User already exists with this email or username.' })).to.be.true;
    });

    // More tests for register
  });
});
