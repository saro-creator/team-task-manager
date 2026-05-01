const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Password ko lock lagana (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    
    res.status(201).json({ message: "User ban gaya! Ab login karo." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "User nahi mila!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Galat password!" });

    // Ek secret token dena (Identity Card)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;