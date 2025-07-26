import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./Login";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

jest.mock("@/lib/config", () => ({
  config: {
    apiUrl: "http://mock-api.com",
  },
}));
jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Spinner</div>,
}));

const mockMutate = jest.fn();
const mockUseLoginUser = {
  mutate: mockMutate,
  isPending: false,
  isError: false,
};

jest.mock("@/hooks/useLoginUser", () => ({
  useLoginUser: jest.fn(() => mockUseLoginUser),
}));

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderLoginWithMock = (overrides = {}) => {
  Object.assign(mockUseLoginUser, overrides);
  return render(
    <QueryClientProvider client={mockQueryClient}>
      <Login />
    </QueryClientProvider>
  );
};

describe("Login components", () => {
  test("Should render component", () => {
    render(
      <QueryClientProvider client={mockQueryClient}>
        <Login />
      </QueryClientProvider>
    );
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Log In/i,
      })
    );
    expect(screen.getByText("Don't have an account?"));
    expect(
      screen.getByRole("link", {
        name: /Sign Up/i,
      })
    );
  });

  describe("Form Validation", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    test("Should show error message for empty email", async () => {
      render(
        <QueryClientProvider client={mockQueryClient}>
          <Login />
        </QueryClientProvider>
      );

      const button = await screen.findByRole("button", { name: "Log in" });
      await user.click(button);

      const emailValidation = screen.getByText("Email is required");
      expect(emailValidation).toBeVisible();
    });

    test("Should show error message for invalid email format", async () => {
      render(
        <QueryClientProvider client={mockQueryClient}>
          <Login />
        </QueryClientProvider>
      );
      const emailField = await screen.getByLabelText("Username");
      user.type(emailField, "test");
      const button = await screen.findByRole("button", { name: "Log in" });
      await user.click(button);

      const emailValidation = screen.getByText("Email is invalid");
      expect(emailValidation).toBeVisible();
    });

    test("Should show error message for empty password", async () => {
      render(
        <QueryClientProvider client={mockQueryClient}>
          <Login />
        </QueryClientProvider>
      );

      const button = await screen.findByRole("button", { name: "Log in" });
      await user.click(button);

      const passwordValidation = screen.getByText("Password is required");
      expect(passwordValidation).toBeVisible();
    });

    test("Should clear error message when user starts typing after validation error", async () => {
      render(
        <QueryClientProvider client={mockQueryClient}>
          <Login />
        </QueryClientProvider>
      );

      const emailField = await screen.getByLabelText("Username");
      const passwordField = await screen.getByLabelText("Password");
      const button = await screen.findByRole("button", { name: "Log in" });

      await user.type(emailField, "test");
      await user.click(button);

      expect(await screen.getByText("Email is invalid")).toBeVisible();
      expect(await screen.getByText("Password is required")).toBeVisible();

      await user.type(emailField, "test@test.com");
      await user.type(passwordField, "test");

      expect(screen.queryByText("Email is invalid")).toBeNull();
      expect(screen.queryByText("Password is required")).toBeNull();
    });
  });

  describe("Form Interactions", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
      mockUseLoginUser.isPending = false;
      mockUseLoginUser.isError = false;
      mockMutate.mockClear();
    });

    test("Should update email field when user types", async () => {
      renderLoginWithMock();

      const emailField = screen.getByLabelText("Username");
      await user.type(emailField, "test@example.com");

      expect(emailField).toHaveValue("test@example.com");
    });

    test("Should update password field when user types", async () => {
      renderLoginWithMock();

      const passwordField = screen.getByLabelText("Password");
      await user.type(passwordField, "password123");

      expect(passwordField).toHaveValue("password123");
    });

    test("Should submit form with valid data", async () => {
      renderLoginWithMock();

      const emailField = screen.getByLabelText("Username");
      const passwordField = screen.getByLabelText("Password");
      const button = screen.getByRole("button", { name: /log in/i });

      await user.type(emailField, "test@example.com");
      await user.type(passwordField, "password123");
      await user.click(button);

      expect(mockMutate).toHaveBeenCalledWith(
        { email: "test@example.com", password: "password123" },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    test("Should prevent form submission with invalid data", async () => {
      renderLoginWithMock();

      const button = screen.getByRole("button", { name: /log in/i });
      await user.click(button);

      expect(screen.getByText("Email is required")).toBeVisible();
      expect(screen.getByText("Password is required")).toBeVisible();
    });
  });

  describe("Loading States", () => {
    test("Should show spinner when login is pending", () => {
      renderLoginWithMock({ isPending: true });

      expect(screen.queryByText("Log in")).not.toBeInTheDocument();
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    test("Should show button text when not loading", () => {
      renderLoginWithMock({ isPending: false });

      expect(screen.getByText("Log in")).toBeInTheDocument();
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    test("Should display error message when login fails", () => {
      renderLoginWithMock({ isError: true });

      expect(
        screen.getByText(
          "An error occurred during registration. Please try again."
        )
      ).toBeVisible();
    });

    test("Should not show error message when no error", () => {
      renderLoginWithMock({ isError: false });

      expect(
        screen.queryByText(
          "An error occurred during registration. Please try again."
        )
      ).not.toBeInTheDocument();
    });
  });

  describe("Hook Integration", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
      mockUseLoginUser.isPending = false;
      mockUseLoginUser.isError = false;
      mockMutate.mockClear();
    });

    test("Should call useLoginUser hook with correct data", async () => {
      renderLoginWithMock();

      const emailField = screen.getByLabelText("Username");
      const passwordField = screen.getByLabelText("Password");
      const button = screen.getByRole("button", { name: /log in/i });

      await user.type(emailField, "test@example.com");
      await user.type(passwordField, "password123");
      await user.click(button);

      expect(mockMutate).toHaveBeenCalledWith(
        { email: "test@example.com", password: "password123" },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    test("Should handle login success callback", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      renderLoginWithMock();

      const emailField = screen.getByLabelText("Username");
      const passwordField = screen.getByLabelText("Password");
      const button = screen.getByRole("button", { name: /log in/i });

      await user.type(emailField, "test@example.com");
      await user.type(passwordField, "password123");
      await user.click(button);

      // Simulate success callback
      const successCallback = mockMutate.mock.calls[0][1].onSuccess;
      const mockResponse = { token: "mock-token" };
      successCallback(mockResponse);

      expect(consoleSpy).toHaveBeenCalledWith("Success:", mockResponse);
      consoleSpy.mockRestore();
    });

    test("Should handle login error callback", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      renderLoginWithMock();

      const emailField = screen.getByLabelText("Username");
      const passwordField = screen.getByLabelText("Password");
      const button = screen.getByRole("button", { name: /log in/i });

      await user.type(emailField, "test@example.com");
      await user.type(passwordField, "password123");
      await user.click(button);

      // Simulate error callback
      const errorCallback = mockMutate.mock.calls[0][1].onError;
      const mockError = new Error("Login failed");
      errorCallback(mockError);

      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("Navigation", () => {
    test("Should have working sign up link", () => {
      renderLoginWithMock();

      const signUpLink = screen.getByRole("link", { name: /sign up/i });
      expect(signUpLink).toHaveAttribute("href", "/signup");
    });
  });
});
