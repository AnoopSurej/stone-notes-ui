import { render, screen } from "@testing-library/react";
import Signup from "./Signup";

describe("Signup Component", () => {
  it("should render labels, input fields, and placeholder text", () => {
    render(<Signup />);

    const emailInput = screen.getByLabelText("Email");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
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

  it("should render Sign Up button, and Login hyperlinl", () => {
    render(<Signup />);

    const signupButton = screen.getByRole("button", { name: "Sign Up" });
    const haveAccountText = screen.getByText("Already have an account?");
    const loginHyperlink = screen.getByRole("link", { name: "Login" });

    expect(signupButton).toBeInTheDocument();
    expect(haveAccountText).toBeInTheDocument();
    expect(loginHyperlink).toBeInTheDocument();
  });
});
