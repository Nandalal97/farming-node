// const mongoose = require('mongoose');

// Connect to User DB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI_FOR_USERS);
//     console.log('✅ User DB Connected');
//   } catch (err) {
//     console.error('❌ User DB Error:', err.message);
//     process.exit(1);
//   }
// };

// Connect to Pest Disease DB and return the connection
// const pestDiseaseConnectDB = async () => {
//   try {
//     const pestDiseaseConnection = mongoose.createConnection(process.env.MONGO_URI_FOR_PEST_DISEASE);

//     pestDiseaseConnection.once('open', () => {
//       console.log('✅ Pest Disease DB Connected');
//     });

//     pestDiseaseConnection.on('error', err => {
//       console.error('❌ Pest Disease DB Error:', err.message);
//     });

//     return pestDiseaseConnection;
//   } catch (err) {
//     console.error('❌ Pest Disease DB Catch Error:', err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
