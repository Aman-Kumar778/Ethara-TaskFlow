import axiosInstance from "./axiosInstance";

/**
 * Fetches all projects for the current user.
 */
export const getProjects = async () => {
  const response = await axiosInstance.get("/projects");
  return response.data;
};

/**
 * Fetches a project by ID.
 */
export const getProjectById = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data;
};

/**
 * Creates a new project.
 */
export const createProject = async (data) => {
  const response = await axiosInstance.post("/projects", data);
  return response.data;
};

/**
 * Updates an existing project.
 */
export const updateProject = async (id, data) => {
  const response = await axiosInstance.put(`/projects/${id}`, data);
  return response.data;
};

/**
 * Deletes a project.
 */
export const deleteProject = async (id) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
};

/**
 * Fetches statistics for a project.
 */
export const getProjectStats = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}/stats`);
  return response.data;
};
