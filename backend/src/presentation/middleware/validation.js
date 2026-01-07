/**
 * Validation middleware using Joi
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errorMessage,
        },
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
