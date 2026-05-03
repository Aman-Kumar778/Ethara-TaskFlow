import axiosInstance from "./axiosInstance";

/**
 * Fetches all members of a project.
 */
export const getMembers = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/members`);
  return response.data;
};

/**
 * Adds a member to a project.
 */
export const addMember = async (projectId, data) => {
  const response = await axiosInstance.post(`/projects/${projectId}/members`, data);
  return response.data;
};

/**
 * Updates a member's role in a project.
 */
export const updateMemberRole = async (projectId, memberId, data) => {
  const response = await axiosInstance.patch(`/projects/${projectId}/members/${memberId}`, data);
  return response.data;
};

/**
 * Removes a member from a project.
 */
export const removeMember = async (projectId, memberId) => {
  const response = await axiosInstance.delete(`/projects/${projectId}/members/${memberId}`);
  return response.data;
};
