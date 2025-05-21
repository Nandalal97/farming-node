require('dotenv').config();
const mongoose = require('mongoose');
// Connect to User DB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://FarmX_Admin82902:Admin%21X82App%25Farm@farmx.khekdnb.mongodb.net/users_db?retryWrites=true&w=majority');
//     console.log('DB Connected');
  } catch (err) {
    console.error('DB Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;



