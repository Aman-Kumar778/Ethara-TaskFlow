const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config/env");
const ApiError = require("./ApiError");

/**
 * Generates an access token.
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Generates a refresh token.
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ _id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Verifies an access token.
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
};

/**
 * Verifies a refresh token.
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
