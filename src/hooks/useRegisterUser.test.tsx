import { renderHook, act, waitFor } from "@testing-library/react";
import { useRegisterUser } from "./useRegisterUser";
import { registerUser, SignupResponse } from "@/services/signupService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignupFormData } from "@/components/signup/Signup";

jest.mock("@/services/signupService", () => ({
  registerUser: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  return wrapper;
};

describe("useRegisterUser", () => {
  const mockFormData: SignupFormData = {
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
    password: "password",
  };
  it("should call registerUser with provided data", async () => {
    const mockSuccessResponse: SignupResponse = {
      message: "success response",
      success: true,
      data: "success data",
      status: 200,
    };
    (registerUser as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockFormData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    console.log(result.current.data);

    expect(registerUser).toHaveBeenCalledWith(mockFormData);
    expect(result.current.data).toEqual(mockSuccessResponse);
  });

  it("should error on failed registration", async () => {
    const mockErrorResponse = new Error("error response");
    (registerUser as jest.Mock).mockRejectedValueOnce(mockErrorResponse);

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockFormData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(registerUser).toHaveBeenCalledWith(mockFormData);
    expect(result.current.error).toEqual(mockErrorResponse);
  });
});
