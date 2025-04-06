/**
 * @jest-environment node
 */

import { config } from "@/lib/config";
import { SignupFormData } from "@/components/signup/Signup";
import { registerUser } from "./signupService";

jest.mock("@/lib/config", () => ({
  config: {
    apiUrl: "http://mock-api.com",
  },
}));

beforeEach(() => {
  jest.spyOn(globalThis, "fetch").mockImplementation(jest.fn());
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("registerUser", () => {
  it("should successfully register a user", async () => {
    const mockResponse = { message: "User registered successfully" };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const formData: SignupFormData = {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };
    const response = await registerUser(formData);

    expect(fetch).toHaveBeenCalledWith(`${config.apiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    expect(response).toEqual(mockResponse);
  });

  it("should throw an error if registration fails", async () => {
    const mockErrorResponse = { message: "Email already exists" };
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(mockErrorResponse),
    });

    const formData: SignupFormData = {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    await expect(registerUser(formData)).rejects.toThrow(
      "Email already exists"
    );
  });

  it("should throw a generic error if response has no message", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    const formData: SignupFormData = {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    await expect(registerUser(formData)).rejects.toThrow(
      "Failed to register user"
    );
  });
});
