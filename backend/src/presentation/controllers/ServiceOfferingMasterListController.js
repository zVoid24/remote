const AppDataSource = require('../../infrastructure/database/data-source');

/**
 * ServiceOfferingMasterList Controller
 * Handles HTTP requests for service offerings master list
 */
class ServiceOfferingMasterListController {
  constructor() {
    this.repository = null;
  }

  async initialize() {
    if (!this.repository) {
      this.repository = AppDataSource.getRepository('ServiceOfferingMasterList');
    }
  }

  /**
   * GET /api/service-offerings-master
   * Get all service offerings from master list
   */
  async getAll(req, res, next) {
    try {
      await this.initialize();
      
      const offerings = await this.repository.find({
        order: {
          title: 'ASC',
        },
      });

      res.json({
        success: true,
        data: offerings,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ServiceOfferingMasterListController;
