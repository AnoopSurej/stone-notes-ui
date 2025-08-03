import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLoginUser } from "./useLoginUser";
import { loginUser, LoginResponse } from "@/services/auth/loginService";
import { ReactNode } from "react";

jest.mock("@/services/auth/loginService");
jest.mock("@/lib/config", () => ({
  config: {
    apiUrl: "http://mock-api.com",
  },
}));

const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useLoginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return useMutation result with correct structure", () => {
    const { result } = renderHook(() => useLoginUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("mutateAsync");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });

  test("should call loginUser service with correct data", async () => {
    const mockResponse = {
      success: true,
      data: "mock-token",
      message: "Login successful",
      status: 200,
    };

    mockedLoginUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLoginUser(), {
      wrapper: createWrapper(),
    });

    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    result.current.mutate(loginData);

    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith(loginData);
    });
  });

  test("should handle successful login", async () => {
    const mockResponse = {
      success: true,
      data: "mock-token",
      message: "Login successful",
      status: 200,
    };

    mockedLoginUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLoginUser(), {
      wrapper: createWrapper(),
    });

    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    result.current.mutate(loginData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.error).toBeNull();
    });
  });

  test("should handle login error", async () => {
    const mockError = new Error("Invalid credentials");
    mockedLoginUser.mockRejectedValue(mockError);

    const { result } = renderHook(() => useLoginUser(), {
      wrapper: createWrapper(),
    });

    const loginData = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    result.current.mutate(loginData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  test("should track pending state during mutation", async () => {
    let resolveLogin: (value: LoginResponse) => void = () => {};
    const loginPromise = new Promise<LoginResponse>((resolve) => {
      resolveLogin = resolve;
    });

    mockedLoginUser.mockReturnValue(loginPromise);

    const { result } = renderHook(() => useLoginUser(), {
      wrapper: createWrapper(),
    });

    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    // Start mutation
    result.current.mutate(loginData);

    // Should be pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Resolve the promise
    resolveLogin({
      success: true,
      data: "token",
      message: "Success",
      status: 200,
    });

    // Should no longer be pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });
});