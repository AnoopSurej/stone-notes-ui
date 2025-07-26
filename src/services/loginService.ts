import { LoginFormData } from "@/components/login/Login";
import { config } from "@/lib/config";

export type LoginResponse = {
  success: boolean;
  data: string | null;
  message: string;
  status: number;
};

export async function loginUser(
  formData: LoginFormData
): Promise<LoginResponse> {
  const response = await fetch(`${config.apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // TODO: Add logging here
    throw new Error(errorData.message || "Failed to login");
  }

  return response.json();
}
