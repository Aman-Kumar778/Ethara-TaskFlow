import axiosInstance from "./axiosInstance";

/**
 * Fetches tasks for a specific project.
 */
export const getTasks = async (projectId, params) => {
  const response = await axiosInstance.get(`/projects/${projectId}/tasks`, { params });
  return response.data;
};

/**
 * Fetches a task by ID.
 */
export const getTaskById = async (projectId, taskId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/tasks/${taskId}`);
  return response.data;
};

/**
 * Creates a new task in a project.
 */
export const createTask = async (projectId, data) => {
  const response = await axiosInstance.post(`/projects/${projectId}/tasks`, data);
  return response.data;
};

/**
 * Updates a task in a project.
 */
export const updateTask = async (projectId, taskId, data) => {
  const response = await axiosInstance.patch(`/projects/${projectId}/tasks/${taskId}`, data);
  return response.data;
};

/**
 * Deletes a task from a project.
 */
export const deleteTask = async (projectId, taskId) => {
  const response = await axiosInstance.delete(`/projects/${projectId}/tasks/${taskId}`);
  return response.data;
};
