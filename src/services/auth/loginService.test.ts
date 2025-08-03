/**
 * @jest-environment node
 */

import { config } from "@/lib/config";
import { LoginFormData } from "@/components/login/Login";
import { LoginResponse, loginUser } from "./loginService";

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

describe("loginUser", () => {
  it("should successfully login user", async () => {
    const mockResponse: LoginResponse = {
      success: true,
      message: "Login successful",
      data: "jwt-token",
      status: 200,
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const loginFormData: LoginFormData = {
      email: "test@test.com",
      password: "password",
    };

    const response: LoginResponse = await loginUser(loginFormData);

    expect(fetch).toHaveBeenCalledWith(`${config.apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginFormData),
    });
    expect(response).toEqual(mockResponse);
  });

  it("should throw an error if login fails with error message", async () => {
    const mockErrorResponse: LoginResponse = {
      success: false,
      message: "Bad credentials",
      data: null,
      status: 401,
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(mockErrorResponse),
    });

    const loginFormData: LoginFormData = {
      email: "test@test.com",
      password: "password-wrong",
    };

    await expect(loginUser(loginFormData)).rejects.toThrow("Bad credentials");
  });

  it("should throw a generic error if response has no message", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    const loginFormData: LoginFormData = {
      email: "test@test.com",
      password: "password",
    };

    await expect(loginUser(loginFormData)).rejects.toThrow("Failed to login");
  });

  it("should handle network errors", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const loginFormData: LoginFormData = {
      email: "test@test.com",
      password: "password",
    };

    await expect(loginUser(loginFormData)).rejects.toThrow("Network error");
  });

  it("should handle malformed JSON response", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    });

    const loginFormData: LoginFormData = {
      email: "test@test.com",
      password: "password",
    };

    await expect(loginUser(loginFormData)).rejects.toThrow("Failed to login");
  });
});
