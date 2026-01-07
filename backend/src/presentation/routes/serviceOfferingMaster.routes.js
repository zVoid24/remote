const express = require('express');
const ServiceOfferingMasterListController = require('../controllers/ServiceOfferingMasterListController');

const router = express.Router();
const controller = new ServiceOfferingMasterListController();

// GET /api/service-offerings-master - Get all service offerings from master list
router.get('/', (req, res, next) => controller.getAll(req, res, next));

module.exports = router;
