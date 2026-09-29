const ApiError = require("../utils/ApiError");

/**
 * Middleware: Restrict access to specific roles.
 * Usage: requireRole("admin") or requireRole("admin", "student")
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Forbidden. You do not have permission to access this resource.")
      );
    }

    next();
  };
};

module.exports = requireRole;
