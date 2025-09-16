const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  comments: {
    type: String,
    required: [true, 'Comments are required'],
  }
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Message', messageSchema);
