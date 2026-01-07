const Joi = require('joi');

/**
 * Validation schema for creating a specialist
 */
const createSpecialistSchema = Joi.object({
  title: Joi.string().min(3).max(255).required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 255 characters',
    }),
  
  description: Joi.string().allow('', null).optional(),
  
  base_price: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'Base price must be a number',
      'number.positive': 'Base price must be positive',
    }),
  
  duration_days: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Duration must be a number',
      'number.integer': 'Duration must be an integer',
      'number.positive': 'Duration must be positive',
    }),
  
  is_draft: Joi.boolean().default(true),
  
  service_offerings: Joi.array().items(Joi.string().uuid()).optional(),
});

/**
 * Validation schema for updating a specialist
 */
const updateSpecialistSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  base_price: Joi.number().positive().precision(2).optional(),
  duration_days: Joi.number().integer().positive().optional(),
  is_draft: Joi.boolean().optional(),
  service_offerings: Joi.array().items(Joi.string().uuid()).optional(),
});

module.exports = {
  createSpecialistSchema,
  updateSpecialistSchema,
};
