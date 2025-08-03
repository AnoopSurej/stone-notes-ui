import { useMutation } from "@tanstack/react-query";
import { loginUser, LoginResponse } from "@/services/auth/loginService";

export function useLoginUser() {
  return useMutation<LoginResponse, Error, { email: string; password: string }>(
    {
      mutationFn: loginUser,
    }
  );
}
