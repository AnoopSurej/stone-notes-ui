import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignedOut from "./SignedOut";

const mockNavigate = jest.fn();
const mockSigninRedirect = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

let mockAuth = {
  isLoading: false,
  isAuthenticated: false,
  signinRedirect: mockSigninRedirect,
};

jest.mock("react-oidc-context", () => ({
  useAuth: () => mockAuth,
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe("SignedOut", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth = {
      isLoading: false,
      isAuthenticated: false,
      signinRedirect: mockSigninRedirect,
    };
  });

  it("should show loading spinner when auth is loading", () => {
    mockAuth.isLoading = true;

    render(
      // need browser router due to the use of useNavigate in this page
      <BrowserRouter>
        <SignedOut />
      </BrowserRouter>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("should render signed out message for unauthenticated users", () => {
    render(
      <BrowserRouter>
        <SignedOut />
      </BrowserRouter>
    );

    expect(screen.getByText("You've been signed out")).toBeInTheDocument();
    expect(screen.getByText(/Your session has ended successfully/)).toBeInTheDocument();
    expect(screen.getByText("Thank you for using Stone Notes")).toBeInTheDocument();
  });

  it("should show Sign In Again button", () => {
    render(
      <BrowserRouter>
        <SignedOut />
      </BrowserRouter>
    );

    expect(screen.getByRole("button", { name: /sign in again/i })).toBeInTheDocument();
  });

  it("should call signinRedirect when Sign In Again is clicked", () => {
    render(
      <BrowserRouter>
        <SignedOut />
      </BrowserRouter>
    );

    const signInButton = screen.getByRole("button", { name: /sign in again/i });
    fireEvent.click(signInButton);

    expect(mockSigninRedirect).toHaveBeenCalled();
  });

  it("should navigate to home when authenticated", () => {
    mockAuth.isAuthenticated = true;

    render(
      <BrowserRouter>
        <SignedOut />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should return null while redirecting authenticated users", () => {
    mockAuth.isAuthenticated = true;

    const { container } = render(
      <BrowserRouter>
        <SignedOut />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it("should display logout icon", () => {
    render(
      <BrowserRouter>
        <SignedOut />
      </BrowserRouter>
    );

    const card = screen.getByText("You've been signed out").closest("div");
    expect(card).toBeInTheDocument();
  });
});
