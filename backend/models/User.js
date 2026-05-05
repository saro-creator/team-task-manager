const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'User'], // Yahan 'User' (Capital U) add kar dein
    default: 'user' 
  }
});

module.exports = mongoose.model('User', userSchema);