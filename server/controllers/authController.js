const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { NODE_ENV } = require("../config/env");

const isProduction = NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create({ name, email, password });
  const userResponse = await User.findById(user._id).select("-password");

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res
    .status(201)
    .json(new ApiResponse(201, { user: userResponse, accessToken }, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const userResponse = await User.findById(user._id).select("-password");

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res
    .status(200)
    .json(new ApiResponse(200, { user: userResponse, accessToken }, "Login successful"));
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", newRefreshToken, cookieOptions);

  res
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Token refreshed successfully"));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { ...cookieOptions, maxAge: 0 });
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").lean();
  res.status(200).json(new ApiResponse(200, user));
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
