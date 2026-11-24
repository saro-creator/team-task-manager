const { describe, it } = require('node:test');
const assert = require('node:assert');
const User = require('../models/User');
const Task = require('../models/Task');

describe('Mongoose Models Validation', () => {
  describe('User Model', () => {
    it('should fail validation if required fields are missing', () => {
      const user = new User({});
      const err = user.validateSync();
      assert.ok(err);
      assert.ok(err.errors.name);
      assert.ok(err.errors.email);
      assert.ok(err.errors.password);
    });

    it('should pass validation with valid fields and set default role', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword'
      });
      const err = user.validateSync();
      assert.strictEqual(err, undefined);
      assert.strictEqual(user.role, 'user');
    });

    it('should fail validation with invalid role enum', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'superadmin'
      });
      const err = user.validateSync();
      assert.ok(err);
      assert.ok(err.errors.role);
    });
  });

  describe('Task Model', () => {
    it('should fail validation if title is missing', () => {
      const task = new Task({});
      const err = task.validateSync();
      assert.ok(err);
      assert.ok(err.errors.title);
    });

    it('should set default status to Todo and priority to Medium', () => {
      const task = new Task({ title: 'Complete testing' });
      const err = task.validateSync();
      assert.strictEqual(err, undefined);
      assert.strictEqual(task.status, 'Todo');
      assert.strictEqual(task.priority, 'Medium');
    });

    it('should fail validation with invalid status enum', () => {
      const task = new Task({
        title: 'Complete testing',
        status: 'Archived'
      });
      const err = task.validateSync();
      assert.ok(err);
      assert.ok(err.errors.status);
    });

    it('should fail validation with invalid priority enum', () => {
      const task = new Task({
        title: 'Complete testing',
        priority: 'Urgent'
      });
      const err = task.validateSync();
      assert.ok(err);
      assert.ok(err.errors.priority);
    });
  });
});
