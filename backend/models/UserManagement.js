const mongoose = require('mongoose');

const userManagementSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserManagement', userManagementSchema);


