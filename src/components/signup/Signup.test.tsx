import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Signup, { SignupFormData } from "./Signup";
import { useNavigate } from "react-router-dom";
import { useRegisterUser } from "@/hooks/useRegisterUser";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/hooks/useRegisterUser", () => ({
  useRegisterUser: jest.fn(() => ({
    mutate: jest.fn((_data, options) => options.onSuccess()), // Simulate successful mutation
    isPending: false,
    isError: false,
    error: null,
  })),
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div>Spinner widget</div>,
}));

describe("Signup Component", () => {
  const mockNavigate = jest.fn();
  const mockFormData: SignupFormData = {
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
    password: "password",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render labels, input fields, and placeholder text", () => {
    render(<Signup />);

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
    render(<Signup />);

    const signupButton = screen.getByRole("button", { name: "Sign Up" });
    const haveAccountText = screen.getByText("Already have an account?");
    const loginHyperlink = screen.getByRole("link", { name: "Login" });

    expect(signupButton).toBeInTheDocument();
    expect(haveAccountText).toBeInTheDocument();
    expect(loginHyperlink).toBeInTheDocument();
  });

  it("should redirect to login page when valid data is submitted, and register request is successful", async () => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const mockMutate = jest.fn((_data, { onSuccess }) => onSuccess());
    (useRegisterUser as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    }));

    render(<Signup />);

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
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<Signup />);

    const signupButton = screen.getByRole("button", { name: "Sign Up" });

    await userEvent.click(signupButton);

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByText("Please confirm password")).toBeInTheDocument();
  });

  it("should display 'invalid email' and 'passwords do not match' validation errors", async () => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<Signup />);

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
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const mockMutate = jest.fn((_data, { onError }) => onError());
    (useRegisterUser as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    }));

    render(<Signup />);

    expect(screen.getByText("Spinner widget")).toBeInTheDocument();
  });

  it("should display error message when registration fails", async () => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const mockMutate = jest.fn((_data, { onError }) => onError());
    (useRegisterUser as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: new Error("failed"),
    }));

    render(<Signup />);

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

    expect(
      screen.getByText(
        "An error occurred during registration. Please try again."
      )
    ).toBeInTheDocument();
    expect(mockMutate).toHaveBeenCalled();
  });
});
