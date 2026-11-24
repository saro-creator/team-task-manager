const { describe, it } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

describe('Auth Middleware', () => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';

  it('should return 401 when Authorization header is missing', () => {
    let statusCode;
    let responseBody;

    const req = {
      header: (headerName) => null
    };
    const res = {
      status(code) {
        statusCode = code;
        return {
          json(body) {
            responseBody = body;
          }
        };
      }
    };
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    authMiddleware(req, res, next);

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(responseBody.message, 'Access Denied! Token nahi mila.');
    assert.strictEqual(nextCalled, false);
  });

  it('should return 400 when Token is invalid', () => {
    let statusCode;
    let responseBody;

    const req = {
      header: (headerName) => 'Bearer invalid.token.value'
    };
    const res = {
      status(code) {
        statusCode = code;
        return {
          json(body) {
            responseBody = body;
          }
        };
      }
    };
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    authMiddleware(req, res, next);

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseBody.message, 'Invalid Token!');
    assert.strictEqual(nextCalled, false);
  });

  it('should set req.user and call next() when Token is valid', () => {
    const payload = { id: 'user123', role: 'user' };
    const token = jwt.sign(payload, secret);

    const req = {
      header: (headerName) => `Bearer ${token}`
    };
    const res = {
      status(code) {
        return { json(body) {} };
      }
    };
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    authMiddleware(req, res, next);

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.id, 'user123');
    assert.strictEqual(req.user.role, 'user');
  });
});
