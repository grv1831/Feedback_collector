const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, required: true },
  options: String
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  adminEmail: { type: String, required: true }
});

module.exports = mongoose.model('Form', formSchema);
