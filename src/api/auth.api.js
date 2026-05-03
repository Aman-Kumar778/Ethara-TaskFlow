import axiosInstance from "./axiosInstance";

/**
 * Registers a new user.
 */
export const registerUser = async (data) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

/**
 * Logs in a user.
 */
export const loginUser = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

/**
 * Logs out a user.
 */
export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

/**
 * Fetches the current user profile.
 */
export const getMe = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

/**
 * Refreshes the access token.
 */
export const refreshToken = async () => {
  const response = await axiosInstance.post("/auth/refresh");
  return response.data;
};
