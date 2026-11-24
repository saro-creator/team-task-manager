const { describe, it } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const tasksRouter = require('../routes/tasks');
const Task = require('../models/Task');

const secret = process.env.JWT_SECRET || 'fallback_secret';
const validUserId = '507f1f77bcf86cd799439011';
const validToken = jwt.sign({ id: validUserId, role: 'user' }, secret);

function invokeTaskRoute(method, url, body = {}, headers = {}) {
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

    tasksRouter.handle(req, res, () => {
      resolve({ status: 404, body: { message: 'Not Found' } });
    });
  });
}

describe('Tasks Routes', () => {
  describe('GET /all', () => {
    it('should return 401 if unauthenticated', async () => {
      const res = await invokeTaskRoute('GET', '/all');
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.message, 'Access Denied! Token nahi mila.');
    });

    it('should return tasks list when authenticated', async () => {
      const mockTasks = [
        { _id: 'task1', title: 'Task 1', status: 'Todo' },
        { _id: 'task2', title: 'Task 2', status: 'Completed' }
      ];

      const origFind = Task.find;
      Task.find = () => ({
        populate: () => ({
          populate: async () => mockTasks
        })
      });

      try {
        const res = await invokeTaskRoute('GET', '/all', {}, {
          authorization: `Bearer ${validToken}`
        });

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.length, 2);
        assert.strictEqual(res.body[0].title, 'Task 1');
      } finally {
        Task.find = origFind;
      }
    });
  });

  describe('POST /create', () => {
    it('should return 401 if unauthenticated', async () => {
      const res = await invokeTaskRoute('POST', '/create', { title: 'New Task' });
      assert.strictEqual(res.status, 401);
    });

    it('should create and return saved task when authenticated', async () => {
      const origSave = Task.prototype.save;
      Task.prototype.save = async function() {
        return {
          _id: 'task-new-1',
          title: this.title,
          description: this.description,
          status: this.status,
          priority: this.priority,
          assignedTo: this.assignedTo,
          createdBy: this.createdBy
        };
      };

      try {
        const res = await invokeTaskRoute('POST', '/create', {
          title: 'New Task',
          description: 'Task description'
        }, {
          authorization: `Bearer ${validToken}`
        });

        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.title, 'New Task');
        assert.strictEqual(res.body.description, 'Task description');
        assert.strictEqual(res.body.createdBy.toString(), validUserId);
      } finally {
        Task.prototype.save = origSave;
      }
    });

    it('should return 400 if save throws error', async () => {
      const origSave = Task.prototype.save;
      Task.prototype.save = async function() {
        throw new Error('Validation failed');
      };

      try {
        const res = await invokeTaskRoute('POST', '/create', {
          title: 'Bad Task'
        }, {
          authorization: `Bearer ${validToken}`
        });

        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.body.message, 'Validation failed');
      } finally {
        Task.prototype.save = origSave;
      }
    });
  });

  describe('PUT /update/:id', () => {
    it('should return 401 if unauthenticated', async () => {
      const res = await invokeTaskRoute('PUT', '/update/task1', { status: 'Completed' });
      assert.strictEqual(res.status, 401);
    });

    it('should update task and return updated task', async () => {
      const origUpdate = Task.findByIdAndUpdate;
      Task.findByIdAndUpdate = async (id, body) => ({
        _id: id,
        ...body
      });

      try {
        const res = await invokeTaskRoute('PUT', '/update/task1', {
          status: 'Completed'
        }, {
          authorization: `Bearer ${validToken}`
        });

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body._id, 'task1');
        assert.strictEqual(res.body.status, 'Completed');
      } finally {
        Task.findByIdAndUpdate = origUpdate;
      }
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should return 401 if unauthenticated', async () => {
      const res = await invokeTaskRoute('DELETE', '/delete/task1');
      assert.strictEqual(res.status, 401);
    });

    it('should delete task and return success message', async () => {
      const origDelete = Task.findByIdAndDelete;
      Task.findByIdAndDelete = async (id) => ({ _id: id });

      try {
        const res = await invokeTaskRoute('DELETE', '/delete/task1', {}, {
          authorization: `Bearer ${validToken}`
        });

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.message, 'Task delete ho gaya!');
      } finally {
        Task.findByIdAndDelete = origDelete;
      }
    });
  });
});
