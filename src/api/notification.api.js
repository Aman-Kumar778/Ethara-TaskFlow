import axiosInstance from "./axiosInstance";

/**
 * Fetches notifications for the current user.
 */
export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

/**
 * Marks all notifications as read.
 */
export const markAllRead = async () => {
  const response = await axiosInstance.patch("/notifications/read-all");
  return response.data;
};

/**
 * Marks a single notification as read.
 */
export const markOneRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
};
