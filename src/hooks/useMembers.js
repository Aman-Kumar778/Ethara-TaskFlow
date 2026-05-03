import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMembers,
  addMember,
  updateMemberRole,
  removeMember,
} from "../api/member.api";

export const useMembers = (projectId) => {
  return useQuery({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => getMembers(projectId),
    enabled: !!projectId,
  });
};

export const useAddMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }) => addMember(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "members"] });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId, data }) => updateMemberRole(projectId, memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "members"] });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }) => removeMember(projectId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "members"] });
    },
  });
};
