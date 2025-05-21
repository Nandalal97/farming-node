// routes/pestDisease.routes.js
const express = require('express');
const router = express.Router();
const { createPestDisease, fetchPestDisease, singlePestDisease } = require('../controllers/pestDiseaseControllers');

router.post('/newPestDisease', createPestDisease);
router.get('/PestDisease', fetchPestDisease);
router.get('/PestDisease/:id', singlePestDisease);


module.exports = router;
