const express = require('express');
const router = express.Router();
const cleaningCompanyController = require('../controllers/cleaningCompanyController');

router.get('/', cleaningCompanyController.getAllCleaningCompanies);
router.get('/:id', cleaningCompanyController.getCleaningCompanyById);
router.post('/', cleaningCompanyController.createCleaningCompany);
router.put('/:id', cleaningCompanyController.updateCleaningCompany);
router.delete('/:id', cleaningCompanyController.deleteCleaningCompany);
router.get('/:id/properties', cleaningCompanyController.getPropertiesForCleaningCompany);

module.exports = router;
