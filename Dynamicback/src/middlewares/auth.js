const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");

/**
 * Middleware: Verify JWT token from cookie or Authorization header.
 * Attaches decoded payload (userId, role) to req.user.
 */
const verifyToken = (req, res, next) => {
  // 1. Try httpOnly cookie first
  let token = req.cookies?.token;

  // 2. Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

module.exports = verifyToken;
