const PestDisease = require('../models/PestModel');

const generate6DigitId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const generateUniqueUserId = async () => {
  let unique = false;
  let pestDiseaseId = '';

  while (!unique) {
    pestDiseaseId = generate6DigitId();
    const existId = await PestDisease.findOne({id:pestDiseaseId });
    if (!existId) {
      unique = true;
    }
  }
  return 'PD'+pestDiseaseId;
};

const createPestDisease = async (req, res) => {
  try {
    const {
      name, image, scientific, category,
      crops, description, symptoms,
      economicImpact, natural, biological,
      chemical, gallery, notes
    } = req.body;
    const nameLower = name.toLowerCase();
    const exist = await PestDisease.findOne({ name: nameLower });
    if (exist) {
      return res.status(409).json({ msg: "Pest/Disease already exists", status: 0 });
    }
    const id = await generateUniqueUserId();
    const newEntry = new PestDisease({
     id, name: nameLower, image, scientific, category,
      crops, description, symptoms,
      economicImpact, natural, biological,
      chemical, gallery, notes
    });

    await newEntry.save();
    return res.status(201).json({ msg: "Added Successfully!", status: 1 });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ msg: "Failed to add record", status: 0 });
  }
};

const fetchPestDisease = async (req, res) => {
  try {
    const { crop, search } = req.query;

    let query = {};

    if (crop) query.crop = crop;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const data = await PestDisease.find(query).sort({ createdAt: -1 });

    res.status(200).json({ msg: 'Success', status:1, data });
  } catch (error) {
    console.error('Error fetching pest/disease:', error.message);
    res.status(500).json({ status: 0, message: 'Server error' });
  }
};

const singlePestDisease = async(req,res)=>{
  try {
    const data = await PestDisease.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ status: 0, message: 'Not found' });
    }
    res.status(200).json({ status: 1, data });
  } catch (err) {
    res.status(500).json({ status: 0, message: 'Server error' });
  }
}


module.exports = {
  createPestDisease,
  fetchPestDisease,
  singlePestDisease
};
