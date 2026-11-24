const { describe, it } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const authRouter = require('../routes/auth');
const User = require('../models/User');

function invokeRoute(method, url, body = {}, headers = {}) {
  return new Promise((resolve) => {
    let statusCode = 200;
    let responseBody;

    const req = {
      method,
      url,
      body,
      headers,
      header: (name) => headers[name.toLowerCase()] || null
    };

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseBody = data;
        resolve({ status: statusCode, body: responseBody });
        return this;
      },
      send(data) {
        responseBody = data;
        resolve({ status: statusCode, body: responseBody });
        return this;
      }
    };

    authRouter.handle(req, res, () => {
      resolve({ status: 404, body: { message: 'Not Found' } });
    });
  });
}

describe('Auth Routes', () => {
  describe('POST /register', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await invokeRoute('POST', '/register', { name: 'Test' });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.message, 'All fields are required');
    });

    it('should return 400 if user already exists', async () => {
      const origFindOne = User.findOne;
      User.findOne = async () => ({ email: 'existing@example.com' });

      try {
        const res = await invokeRoute('POST', '/register', {
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'password123'
        });

        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.body.message, 'User pehle se maujood hai!');
      } finally {
        User.findOne = origFindOne;
      }
    });

    it('should successfully register a new user', async () => {
      const origFindOne = User.findOne;
      const origSave = User.prototype.save;
      User.findOne = async () => null;
      User.prototype.save = async function() { return this; };

      try {
        const res = await invokeRoute('POST', '/register', {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'securePassword123'
        });

        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.message, 'User ban gaya! Ab login karo.');
      } finally {
        User.findOne = origFindOne;
        User.prototype.save = origSave;
      }
    });
  });

  describe('POST /login', () => {
    it('should return 400 if email or password missing', async () => {
      const res = await invokeRoute('POST', '/login', { email: 'test@example.com' });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.message, 'Email and password are required');
    });

    it('should return 404 if user not found', async () => {
      const origFindOne = User.findOne;
      User.findOne = async () => null;

      try {
        const res = await invokeRoute('POST', '/login', {
          email: 'notfound@example.com',
          password: 'pwd'
        });

        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.body.message, 'User nahi mila!');
      } finally {
        User.findOne = origFindOne;
      }
    });

    it('should return 400 if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      const origFindOne = User.findOne;
      User.findOne = async () => ({
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user'
      });

      try {
        const res = await invokeRoute('POST', '/login', {
          email: 'test@example.com',
          password: 'wrongPassword'
        });

        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.body.message, 'Galat password!');
      } finally {
        User.findOne = origFindOne;
      }
    });

    it('should return 200 with token and user on successful login', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      const origFindOne = User.findOne;
      User.findOne = async () => ({
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user'
      });

      try {
        const res = await invokeRoute('POST', '/login', {
          email: 'test@example.com',
          password: 'correctPassword'
        });

        assert.strictEqual(res.status, 200);
        assert.ok(res.body.token);
        assert.strictEqual(res.body.user.name, 'Test User');
        assert.strictEqual(res.body.user.email, 'test@example.com');
      } finally {
        User.findOne = origFindOne;
      }
    });
  });
});
