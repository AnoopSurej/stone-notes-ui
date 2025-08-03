import { SignupFormData } from "@/components/signup/Signup";
import { config } from "@/lib/config";

export type SignupResponse = {
  success: boolean;
  data: string | null;
  message: string;
  status: number;
};

export async function registerUser(
  formData: SignupFormData
): Promise<SignupResponse> {
  const response = await fetch(`${config.apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // TODO: Add logging here
    throw new Error(errorData.message || "Failed to register user");
  }

  return response.json();
}
