const express = require('express');
const SpecialistController = require('../controllers/SpecialistController');
const validate = require('../middleware/validation');
const { createSpecialistSchema, updateSpecialistSchema } = require('../../application/dtos/createSpecialistDto');

const router = express.Router();
const specialistController = new SpecialistController();

// GET /api/specialists - List all specialists with filters
router.get('/', (req, res, next) => specialistController.getAll(req, res, next));

// GET /api/specialists/:id - Get single specialist
router.get('/:id', (req, res, next) => specialistController.getById(req, res, next));

// POST /api/specialists - Create new specialist
router.post('/', validate(createSpecialistSchema), (req, res, next) => 
  specialistController.create(req, res, next)
);

// PUT /api/specialists/:id - Update specialist
router.put('/:id', validate(updateSpecialistSchema), (req, res, next) => 
  specialistController.update(req, res, next)
);

// DELETE /api/specialists/:id - Delete specialist
router.delete('/:id', (req, res, next) => specialistController.delete(req, res, next));

// PATCH /api/specialists/:id/publish - Publish specialist
router.patch('/:id/publish', (req, res, next) => specialistController.publish(req, res, next));

const upload = require('../middleware/upload');

// POST /api/specialists/:id/media - Upload media
router.post('/:id/media', upload.array('images', 3), (req, res, next) => specialistController.uploadMedia(req, res, next));

// DELETE /api/specialists/:id/media/:mediaId - Delete media
router.delete('/:id/media/:mediaId', (req, res, next) => specialistController.deleteMedia(req, res, next));

module.exports = router;
