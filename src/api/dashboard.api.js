import axiosInstance from "./axiosInstance";

/**
 * Fetches dashboard data for the current user.
 */
export const getDashboard = async () => {
  const response = await axiosInstance.get("/dashboard");
  return response.data;
};
