const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check karein ki user pehle se toh nahi hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User pehle se maujood hai!" });
    }

    // Password ko secure banana (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role ? role.toLowerCase() : 'user'
    });

    await newUser.save();
    res.status(201).json({ message: "User ban gaya! Ab login karo." });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// 2. Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // User ko dhoondna
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User nahi mila!" });
    }

    // Password match karna
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Galat password!" });
    }

    // JWT Token generate karna
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

module.exports = router;
