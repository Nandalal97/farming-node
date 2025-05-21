// PestModel.js
const mongoose = require('mongoose');

const pestDiseaseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  image: {
    type: String,
    required: true,
  },
  scientific: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Pest', 'Disease'],
  },
  crops: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  symptoms: {
    type: [String],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
  economicImpact: {
    type: [String],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
  natural: {
    type: [String],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
  biological: {
    type: [String],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
  chemical: {
    type: [String],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
  gallery: {
    type: [String],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// const getPestModel = async () => {
//   const connection = await connectPestDB();
//   return connection.model('PestDisease', pestDiseaseSchema);
// };

// module.exports = getPestModel;

// Use the pestDB connection
const PestDisease = mongoose.model('PestDisease', pestDiseaseSchema);

module.exports = PestDisease;