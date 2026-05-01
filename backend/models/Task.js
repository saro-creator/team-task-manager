const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Todo', 'In Progress', 'Completed'], default: 'Todo' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Kaun karega kaam?
  dueDate: Date
});

module.exports = mongoose.model('Task', TaskSchema);
