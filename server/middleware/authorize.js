const ProjectMember = require("../models/ProjectMember.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Middleware to authorize requests based on project roles.
 */
const requireProjectRole = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "Project ID is required");
    }

    const membership = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
    });

    if (!membership) {
      throw new ApiError(403, "Not a member of this project");
    }

    if (!allowedRoles.includes(membership.role)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    req.membership = membership;
    next();
  });
};

module.exports = { requireProjectRole };
