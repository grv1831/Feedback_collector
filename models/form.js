const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: {
    type: [String], // ✅ Fix: array of strings
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Form', formSchema);
