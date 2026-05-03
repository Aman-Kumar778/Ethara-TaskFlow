import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, loginUser, registerUser, logoutUser } from "../api/auth.api";

export const useGetMe = (options = {}) => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    staleTime: Infinity,
    ...options,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
