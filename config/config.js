require('dotenv').config();
const mongoose = require('mongoose');

// Connect to User DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_FOR_USERS);
    console.log(' DB Connected');
  } catch (err) {
    console.error(' DB Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
