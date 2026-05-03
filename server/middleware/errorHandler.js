const ApiError = require("../utils/ApiError");
const { NODE_ENV } = require("../config/env");

/**
 * Global error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === "ValidationError" ? 422 : 500);
    const message = error.message || "Internal server error";
    
    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
      error = new ApiError(409, "Resource already exists");
    } else {
      error = new ApiError(statusCode, message, error?.errors || []);
    }
  }

  const response = {
    ...error,
    message: error.message,
    stack: NODE_ENV === "development" ? error.stack : undefined,
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
