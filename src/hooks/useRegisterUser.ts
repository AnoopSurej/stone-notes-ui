import { useMutation } from "@tanstack/react-query";
import { registerUser, SignupResponse } from "@/services/signupService";

export function useRegisterUser() {
  return useMutation<
    SignupResponse,
    Error,
    { email: string; password: string; firstName: string; lastName: string }
  >({
    mutationFn: registerUser,
  });
}
