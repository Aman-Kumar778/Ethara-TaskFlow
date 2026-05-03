import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../api/task.api";

export const useTasks = (projectId, params) => {
  return useQuery({
    queryKey: ["projects", projectId, "tasks", params],
    queryFn: () => getTasks(projectId, params),
    enabled: !!projectId,
  });
};

export const useTask = (projectId, taskId) => {
  return useQuery({
    queryKey: ["projects", projectId, "tasks", taskId],
    queryFn: () => getTaskById(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }) => createTask(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId, data }) => updateTask(projectId, taskId, data),
    onMutate: async (newVariables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["projects", newVariables.projectId, "tasks"] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["projects", newVariables.projectId, "tasks"]);

      // Optimistically update to the new value
      if (previousTasks && newVariables.data.status) {
        queryClient.setQueryData(["projects", newVariables.projectId, "tasks"], (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((task) =>
                task._id === newVariables.taskId ? { ...task, status: newVariables.data.status } : task
              ),
            },
          };
        });
      }

      return { previousTasks };
    },
    onError: (err, newVariables, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(["projects", newVariables.projectId, "tasks"], context.previousTasks);
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId }) => deleteTask(projectId, taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
