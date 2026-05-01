
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Ye rasta tasks ko "GET" karne ke liye hai
router.get('/all', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;