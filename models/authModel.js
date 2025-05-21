const connectDB = require('../config/config');
connectDB();
const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  userId: {
  type: String,
  required: true,
  unique: true,
},
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  address: {
    type: String,
    lowercase: true,
    trim: true,
  },
  state: {
    type: String,
    lowercase: true,
    trim: true,
  },
  city: {
    type: String,
    lowercase: true,
    trim: true,
  },
  pin: {
    type: String,
    lowercase: true,
    trim: true,
  },
  dob: {
    type: String,
    lowercase: true,
    trim: true,
  },
  gender: {
    type: String,
    lowercase: true,
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', authSchema);
