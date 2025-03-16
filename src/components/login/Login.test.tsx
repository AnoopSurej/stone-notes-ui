import Login from "./Login";
import { render, screen } from "@testing-library/react";

describe("Login components", () => {
  test("Should render component", () => {
    render(<Login />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
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
});
