import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import Signup, { SignupFormData } from "./Signup";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockMutate = jest.fn();
const mockNavigate = jest.fn();
const mockUseRegisterUser = {
  mutate: mockMutate,
  isPending: false,
  isError: false,
  error: null,
};

jest.mock("@/hooks/useRegisterUser", () => ({
  useRegisterUser: jest.fn(() => mockUseRegisterUser),
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Spinner widget</div>,
}));

const renderSignupWithMock = (overrides = {}) => {
  Object.assign(mockUseRegisterUser, overrides);
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  return render(<Signup />);
};

describe("Signup Component", () => {
  const mockFormData: SignupFormData = {
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
    password: "password123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRegisterUser.isPending = false;
    mockUseRegisterUser.isError = false;
    mockUseRegisterUser.error = null;
    mockMutate.mockClear();
    mockNavigate.mockClear();
  });

  it("should render labels, input fields, and placeholder text", () => {
    renderSignupWithMock();

    const emailInput = screen.getByLabelText("Email");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "text");
    expect(emailInput).toHaveAttribute("placeholder", "m@example.com");

    expect(firstNameInput).toBeInTheDocument();
    expect(firstNameInput).toHaveAttribute("type", "text");
    expect(firstNameInput).toHaveAttribute("placeholder", "John");

    expect(lastNameInput).toBeInTheDocument();
    expect(lastNameInput).toHaveAttribute("type", "text");
    expect(lastNameInput).toHaveAttribute("placeholder", "Doe");

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("placeholder", "••••••••");

    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("placeholder", "••••••••");
  });

  it("should render Sign Up button, and Login hyperlink", () => {
    renderSignupWithMock();

    const signupButton = screen.getByRole("button", { name: "Sign Up" });
    const haveAccountText = screen.getByText("Already have an account?");
    const loginHyperlink = screen.getByRole("link", { name: "Login" });

    expect(signupButton).toBeInTheDocument();
    expect(haveAccountText).toBeInTheDocument();
    expect(loginHyperlink).toBeInTheDocument();
  });

  it("should redirect to login page when valid data is submitted, and register request is successful", async () => {
    renderSignupWithMock();

    // Configure success callback behavior
    mockMutate.mockImplementation((_data, { onSuccess }) => onSuccess());

    const emailInput = screen.getByLabelText("Email");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await userEvent.type(emailInput, mockFormData.email);
    await userEvent.type(firstNameInput, mockFormData.firstName);
    await userEvent.type(lastNameInput, mockFormData.lastName);
    await userEvent.type(passwordInput, mockFormData.password);
    await userEvent.type(confirmPasswordInput, mockFormData.password);

    const signupButton = screen.getByRole("button", { name: "Sign Up" });

    await userEvent.click(signupButton);

    expect(mockMutate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should display required field validation error when empty field is submitted", async () => {
    renderSignupWithMock();

    const signupButton = screen.getByRole("button", { name: "Sign Up" });

    await userEvent.click(signupButton);

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByText("Please confirm password")).toBeInTheDocument();
  });

  it("should display 'invalid email' and 'passwords do not match' validation errors", async () => {
    renderSignupWithMock();

    const emailInput = screen.getByLabelText("Email");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await userEvent.type(emailInput, "test");
    await userEvent.type(firstNameInput, mockFormData.firstName);
    await userEvent.type(lastNameInput, mockFormData.lastName);
    await userEvent.type(passwordInput, mockFormData.password);
    await userEvent.type(confirmPasswordInput, "different");

    const signupButton = screen.getByRole("button", { name: "Sign Up" });

    await userEvent.click(signupButton);

    expect(screen.getByText("Email is invalid")).toBeInTheDocument();
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("should display spinner in sign up button when registration request is pending", async () => {
    renderSignupWithMock({ isPending: true });

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  });

  it("should display error message when registration fails", async () => {
    renderSignupWithMock({ isError: true });

    expect(
      screen.getByText(
        "An error occurred during registration. Please try again."
      )
    ).toBeVisible();
  });

  describe("Form Validation", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    test("Should show password minimum length validation error", async () => {
      renderSignupWithMock();

      const passwordInput = screen.getByLabelText("Password");
      const signupButton = screen.getByRole("button", { name: "Sign Up" });

      await user.type(passwordInput, "test");
      await user.click(signupButton);

      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeVisible();
    });

    test("Should clear error message when user starts typing after validation error", async () => {
      renderSignupWithMock();

      const passwordInput = screen.getByLabelText("Password");
      const signupButton = screen.getByRole("button", { name: "Sign Up" });

      await user.type(passwordInput, "test");
      await user.click(signupButton);

      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeVisible();

      await user.type(passwordInput, "test123");
      expect(
        screen.queryByText("Password must be at least 8 characters")
      ).toBeNull();
    });
  });

  describe("Form Interactions", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    test("Should update email field when user types", async () => {
      renderSignupWithMock();

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "test@email.com");

      expect(emailInput).toHaveValue("test@email.com");
    });

    test("Should update firstName field when user types", async () => {
      renderSignupWithMock();

      const firstNameInput = screen.getByLabelText("First Name");
      await user.type(firstNameInput, "firstName");

      expect(firstNameInput).toHaveValue("firstName");
    });

    test("Should update lastName field when user types", async () => {
      renderSignupWithMock();

      const lastNameInput = screen.getByLabelText("Last Name");
      await user.type(lastNameInput, "lastName");

      expect(lastNameInput).toHaveValue("lastName");
    });

    test("Should update password field when user types", async () => {
      renderSignupWithMock();

      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    test("Should update confirmPassword field when user types", async () => {
      renderSignupWithMock();

      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      await user.type(confirmPasswordInput, "password123");

      expect(confirmPasswordInput).toHaveValue("password123");
    });
  });

  describe("Loading States", () => {
    test("Should disable button and show spinner during loading", () => {
      renderSignupWithMock({ isPending: true });

      const signupButton = screen.getByRole("button");

      expect(signupButton).toBeDisabled();
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
      expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    });

    test("Should show button text when not loading", () => {
      renderSignupWithMock({ isPending: false });

      const signupButton = screen.getByRole("button", { name: "Sign Up" });

      expect(signupButton).not.toBeDisabled();
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    test("Should not show error message when no error", () => {
      renderSignupWithMock({ isError: false });

      expect(
        screen.queryByText(
          "An error occurred during registration. Please try again."
        )
      ).not.toBeInTheDocument();
    });

    test("Should handle registration error callback", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const user = userEvent.setup();

      // Set up mock with error state to match component behavior
      const mockError = new Error("Registration failed");
      renderSignupWithMock({ error: mockError });

      // Configure error callback behavior
      mockMutate.mockImplementation((_data, { onError }) => onError());

      const emailInput = screen.getByLabelText("Email");
      const firstNameInput = screen.getByLabelText("First Name");
      const lastNameInput = screen.getByLabelText("Last Name");
      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const signupButton = screen.getByRole("button", { name: "Sign Up" });

      await user.type(emailInput, "test@example.com");
      await user.type(firstNameInput, "Test");
      await user.type(lastNameInput, "User");
      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");
      await user.click(signupButton);

      // The component logs the error state variable, not the callback parameter
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      consoleSpy.mockRestore();
    });
  });

  describe("Hook Integration", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    test("Should call useRegisterUser hook with correct data", async () => {
      renderSignupWithMock();

      const emailInput = screen.getByLabelText("Email");
      const firstNameInput = screen.getByLabelText("First Name");
      const lastNameInput = screen.getByLabelText("Last Name");
      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const signupButton = screen.getByRole("button", { name: "Sign Up" });

      await user.type(emailInput, "test@example.com");
      await user.type(firstNameInput, "Test");
      await user.type(lastNameInput, "User");
      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");
      await user.click(signupButton);

      expect(mockMutate).toHaveBeenCalledWith(
        {
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          password: "password123",
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    test("Should handle registration success callback with navigation", async () => {
      renderSignupWithMock();

      // Configure success callback behavior
      mockMutate.mockImplementation((_data, { onSuccess }) => onSuccess());

      const emailInput = screen.getByLabelText("Email");
      const firstNameInput = screen.getByLabelText("First Name");
      const lastNameInput = screen.getByLabelText("Last Name");
      const passwordInput = screen.getByLabelText("Password");
      const confirmPasswordInput = screen.getByLabelText("Confirm Password");
      const signupButton = screen.getByRole("button", { name: "Sign Up" });

      await user.type(emailInput, "test@example.com");
      await user.type(firstNameInput, "Test");
      await user.type(lastNameInput, "User");
      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");
      await user.click(signupButton);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("UI Components", () => {
    test("Should show red border on error fields", async () => {
      const user = userEvent.setup();
      renderSignupWithMock();

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const signupButton = screen.getByRole("button", { name: "Sign Up" });

      // Trigger validation errors
      await user.type(emailInput, "invalid-email");
      await user.type(passwordInput, "short");
      await user.click(signupButton);

      // Check for red border class
      expect(emailInput).toHaveClass("border-red-500");
      expect(passwordInput).toHaveClass("border-red-500");
    });
  });

  describe("Navigation", () => {
    test("Should have working login link", () => {
      renderSignupWithMock();

      const loginLink = screen.getByRole("link", { name: /login/i });
      expect(loginLink).toHaveAttribute("href", "/login");
    });
  });
});
