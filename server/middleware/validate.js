const ApiError = require("../utils/ApiError");

/**
 * Middleware to validate request body against a Zod schema.
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      next(new ApiError(422, "Validation failed", formattedErrors));
    }
  };
};

module.exports = validate;
