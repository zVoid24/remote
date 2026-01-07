const SpecialistService = require('../../application/services/SpecialistService');

/**
 * Specialist Controller
 * Handles HTTP requests for specialist endpoints
 */
class SpecialistController {
  constructor() {
    this.specialistService = new SpecialistService();
  }

  /**
   * GET /api/specialists
   * Get all specialists with filtering and pagination
   */
  async getAll(req, res, next) {
    try {
      const { page, limit, search, status, sortBy, sortOrder } = req.query;
      
      const result = await this.specialistService.getAll({
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
      });

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/specialists/:id
   * Get single specialist by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const specialist = await this.specialistService.getById(id);

      res.json({
        success: true,
        data: specialist,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/specialists
   * Create new specialist
   */
  async create(req, res, next) {
    try {
      const specialist = await this.specialistService.create(req.body);

      res.status(201).json({
        success: true,
        data: specialist,
        message: 'Specialist created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/specialists/:id
   * Update specialist
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const specialist = await this.specialistService.update(id, req.body);

      res.json({
        success: true,
        data: specialist,
        message: 'Specialist updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/specialists/:id
   * Delete specialist
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.specialistService.delete(id);

      res.json({
        success: true,
        message: 'Specialist deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/specialists/:id/publish
   * Publish specialist
   */
  async publish(req, res, next) {
    try {
      const { id } = req.params;
      const specialist = await this.specialistService.publish(id);

      res.json({
        success: true,
        data: specialist,
        message: 'Specialist published successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/specialists/:id/media
   * Upload media for specialist
   */
  async uploadMedia(req, res, next) {
    try {
      const { id } = req.params;
      const files = req.files;
      const { tierName } = req.body;

      console.log('Upload request files:', JSON.stringify(files, null, 2));

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
      }

      const media = await this.specialistService.uploadMedia(id, files, tierName);

      res.status(201).json({
        success: true,
        data: media,
        message: 'Media uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/specialists/:id/media/:mediaId
   * Delete media
   */
  async deleteMedia(req, res, next) {
    try {
      const { id, mediaId } = req.params;
      await this.specialistService.deleteMedia(id, mediaId);

      res.json({
        success: true,
        message: 'Media deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SpecialistController;
