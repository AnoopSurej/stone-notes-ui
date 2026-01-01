import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";

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

describe("HomePage", () => {
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
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("should render landing page for unauthenticated users", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText("Stone Notes")).toBeInTheDocument();
    expect(
      screen.getByText("Your secure, simple note-taking companion.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
  });

  it("should show stone.svg logo", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const logo = screen.getByAltText("Stone Notes");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/stone.svg");
  });

  it("should call signinRedirect when Get Started is clicked", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const getStartedButton = screen.getByRole("button", { name: /get started/i });
    fireEvent.click(getStartedButton);

    expect(mockSigninRedirect).toHaveBeenCalled();
  });

  it("should navigate to /notes when authenticated", () => {
    mockAuth.isAuthenticated = true;

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/notes");
  });

  it("should return null while redirecting authenticated users", () => {
    mockAuth.isAuthenticated = true;

    const { container } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});