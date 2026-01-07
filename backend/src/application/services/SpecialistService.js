const AppDataSource = require('../../infrastructure/database/data-source');
const Specialist = require('../../domain/entities/Specialist');

/**
 * Specialist Service
 * Handles business logic for specialist operations
 */
class SpecialistService {
  constructor() {
    this.specialistRepository = null;
  }

  async initialize() {
    if (!this.specialistRepository) {
      this.specialistRepository = AppDataSource.getRepository('Specialist');
      this.mediaRepository = AppDataSource.getRepository('Media');
    }
  }

  /**
   * Generate slug from title
   * @param {string} title - Specialist title
   * @returns {string} Generated slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now();
  }

  /**
   * Calculate platform fee
   * @param {number} basePrice - Base price
   * @returns {Promise<number>} Platform fee amount
   */
  async calculatePlatformFee(basePrice) {
    // Simple 10% platform fee for now
    // TODO: Implement tiered pricing from platform_fee table
    return basePrice * 0.10;
  }

  /**
   * Get all specialists with filtering and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Paginated specialists
   */
  async getAll(filters = {}) {
    await this.initialize();

    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = filters;

    const skip = (page - 1) * limit;
    const queryBuilder = this.specialistRepository.createQueryBuilder('specialist');

    // Apply status filter
    if (status === 'drafts') {
      queryBuilder.where('specialist.is_draft = :isDraft', { isDraft: true });
    } else if (status === 'published') {
      queryBuilder.where('specialist.is_draft = :isDraft', { isDraft: false });
    }

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(specialist.title ILIKE :search OR specialist.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const specialists = await queryBuilder
      .leftJoinAndSelect('specialist.media', 'media')
      .skip(skip)
      .take(limit)
      .orderBy(`specialist.${sortBy}`, sortOrder)
      .getMany();

    // Compute media URLs
    specialists.forEach(specialist => {
      if (specialist.media) {
        specialist.media.forEach(media => {
          media.url = `http://localhost:3000/uploads/${media.file_name}`;
        });
      }
    });

    return {
      data: specialists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get specialist by ID
   * @param {string} id - Specialist ID
   * @returns {Promise<Object>} Specialist
   */
  async getById(id) {
    await this.initialize();
    
    const specialist = await this.specialistRepository.findOne({
      where: { id },
      relations: ['serviceOfferings', 'media'],
    });

    if (!specialist) {
      const error = new Error('Specialist not found');
      error.statusCode = 404;
      throw error;
    }

    // Compute media URLs
    if (specialist.media) {
      specialist.media.forEach(media => {
        media.url = `http://localhost:3000/uploads/${media.file_name}`;
      });
    }

    return specialist;
  }

  /**
   * Create new specialist
   * @param {Object} data - Specialist data
   * @returns {Promise<Object>} Created specialist
   */
  async create(data) {
    await this.initialize();

    const slug = this.generateSlug(data.title);
    const platformFee = await this.calculatePlatformFee(data.base_price);
    const finalPrice = parseFloat(data.base_price) + platformFee;

    const specialist = this.specialistRepository.create({
      ...data,
      slug,
      platform_fee: platformFee,
      final_price: finalPrice,
      verification_status: 'pending',
      is_verified: false,
      average_rating: 0,
      total_number_of_ratings: 0,
    });

    return await this.specialistRepository.save(specialist);
  }

  /**
   * Update specialist
   * @param {string} id - Specialist ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated specialist
   */
  async update(id, data) {
    await this.initialize();

    const specialist = await this.getById(id);

    // Recalculate fees if base_price changed
    if (data.base_price && data.base_price !== specialist.base_price) {
      const platformFee = await this.calculatePlatformFee(data.base_price);
      data.platform_fee = platformFee;
      data.final_price = parseFloat(data.base_price) + platformFee;
    }

    // Update slug if title changed
    if (data.title && data.title !== specialist.title) {
      data.slug = this.generateSlug(data.title);
    }

    Object.assign(specialist, data);
    return await this.specialistRepository.save(specialist);
  }

  /**
   * Delete specialist
   * @param {string} id - Specialist ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.initialize();
    
    const specialist = await this.getById(id);
    await this.specialistRepository.remove(specialist);
  }

  /**
   * Publish specialist
   * @param {string} id - Specialist ID
   * @returns {Promise<Object>} Published specialist
   */
  async publish(id) {
    await this.initialize();
    
    const specialist = await this.getById(id);
    specialist.is_draft = false;
    return await this.specialistRepository.save(specialist);
  }
  /**
   * Upload media for specialist
   * @param {string} id - Specialist ID
   * @param {Array} files - Uploaded files
   * @param {string} tierName - Tier name (default: 'standard')
   * @returns {Promise<Array>} Created media entities
   */
  async uploadMedia(id, files, tierName = 'standard') {
    await this.initialize();
    
    const specialist = await this.getById(id);
    
    const mediaEntities = files.map(file => {
      console.log('Processing file:', file);
      const filename = file.filename || file.originalname;
      return this.mediaRepository.create({
        specialist: specialist,
        tier_name: tierName,
        media_type: 'image',
        file_name: filename,
        mime_type: file.mimetype,
        file_size: file.size,
      });
    });

    const savedMedia = await this.mediaRepository.save(mediaEntities);

    // Add URL to returned media
    savedMedia.forEach(media => {
      media.url = `http://localhost:3000/uploads/${media.file_name}`;
    });

    return savedMedia;
  }

  /**
   * Delete media
   * @param {string} specialistId - Specialist ID
   * @param {string} mediaId - Media ID
   * @returns {Promise<void>}
   */
  async deleteMedia(specialistId, mediaId) {
    await this.initialize();

    const media = await this.mediaRepository.findOne({
      where: { id: mediaId, specialist: { id: specialistId } },
    });

    if (!media) {
      const error = new Error('Media not found');
      error.statusCode = 404;
      throw error;
    }

    // TODO: Delete file from disk if needed
    // const fs = require('fs');
    // const path = require('path');
    // const filePath = path.join(__dirname, '../../../../uploads', media.file_name);
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    await this.mediaRepository.remove(media);
  }
}

module.exports = SpecialistService;
