const express = require('express');
const router = express.Router();
const patronesController = require('../controllers/patronesController');
const { checkPlanLimits } = require('../middleware/plan');

router.get('/', patronesController.getPatrones);
router.get('/:id', patronesController.getPatron);
router.post('/', checkPlanLimits, patronesController.createPatron);
router.put('/:id', checkPlanLimits, patronesController.updatePatron);
router.delete('/:id', patronesController.deletePatron);
router.get('/:id/pdf', patronesController.exportPdf);

module.exports = router;
