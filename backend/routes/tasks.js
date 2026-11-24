const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // Security middleware

// 1. Saare tasks get karein (Assigned user ke naam ke saath)
router.get('/all', auth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Naya task banayein (Create)
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id,
      dueDate
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Task ka status ya details update karein (Update)
router.put('/update/:id', auth, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Task delete karein (Delete)
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task delete ho gaya!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
