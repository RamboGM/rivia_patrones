const express = require('express');
const router = express.Router();
const patronesController = require('../controllers/patronesController');

// Ruta para crear un patrón
router.post('/', patronesController.createPatron);

// Ruta para obtener todos los patrones
router.get('/', patronesController.getPatrones);

module.exports = router;
