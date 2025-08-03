import { renderHook, act, waitFor } from "@testing-library/react";
import { useRegisterUser } from "./useRegisterUser";
import { registerUser, SignupResponse } from "@/services/auth/signupService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignupFormData } from "@/components/signup/Signup";
import { ReactNode } from "react";

jest.mock("@/services/auth/signupService");
jest.mock("@/lib/config", () => ({
  config: {
    apiUrl: "http://mock-api.com",
  },
}));

const mockedRegisterUser = registerUser as jest.MockedFunction<
  typeof registerUser
>;

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

describe("useRegisterUser", () => {
  const mockFormData: SignupFormData = {
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    password: "password123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return useMutation result with correct structure", () => {
    const { result } = renderHook(() => useRegisterUser(), {
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

  test("should call registerUser service with correct data", async () => {
    const mockResponse: SignupResponse = {
      success: true,
      data: "user-id",
      message: "Registration successful",
      status: 201,
    };

    mockedRegisterUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockFormData);
    });

    await waitFor(() => {
      expect(mockedRegisterUser).toHaveBeenCalledWith(mockFormData);
    });
  });

  test("should handle successful registration", async () => {
    const mockResponse: SignupResponse = {
      success: true,
      data: "user-id",
      message: "Registration successful",
      status: 201,
    };

    mockedRegisterUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockFormData);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.error).toBeNull();
    });
  });

  test("should handle registration error", async () => {
    const mockError = new Error("Email already exists");
    mockedRegisterUser.mockRejectedValue(mockError);

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockFormData);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  test("should track pending state during mutation", async () => {
    let resolveRegister: (value: SignupResponse) => void = () => {};
    const registerPromise = new Promise<SignupResponse>((resolve) => {
      resolveRegister = resolve;
    });

    mockedRegisterUser.mockReturnValue(registerPromise);

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: createWrapper(),
    });

    // Start mutation
    act(() => {
      result.current.mutate(mockFormData);
    });

    // Should be pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Resolve the promise
    act(() => {
      resolveRegister({
        success: true,
        data: "user-id",
        message: "Success",
        status: 201,
      });
    });

    // Should no longer be pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
