const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../../middleware/authenticateToken');

describe('authenticateToken Middleware', () => {
  let chai;
  let expect;

  before(async () => {
    chai = await import('chai');
    expect = chai.expect;
  });

  it('should call next() when token is valid', () => {
    const req = {
      headers: {
        authorization: 'Bearer valid.token.here'
      }
    };
    const res = {};
    const next = sinon.spy();

    sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
      callback(null, { user: 'valid user' });
    });

    authenticateToken(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(req.user).to.eql({ user: 'valid user' });

    jwt.verify.restore();
  });

  it('should return 401 if no token is provided', () => {
    const req = { headers: {} };
    const res = {
      sendStatus: sinon.spy()
    };
    const next = sinon.spy();

    authenticateToken(req, res, next);

    expect(res.sendStatus.calledOnceWith(401)).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return 403 if token is invalid', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid.token.here'
      }
    };
    const res = {
      sendStatus: sinon.spy()
    };
    const next = sinon.spy();

    sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    authenticateToken(req, res, next);

    expect(res.sendStatus.calledOnceWith(403)).to.be.true;
    expect(next.notCalled).to.be.true;

    jwt.verify.restore();
  });
});
