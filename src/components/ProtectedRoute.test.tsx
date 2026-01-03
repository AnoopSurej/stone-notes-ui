import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";

jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Spinner</div>,
}));

let mockIsLoading: boolean = false;
let mockIsAuthenticated: boolean = false;
const mockActiveNavigator: string | undefined = undefined;

const mockSigninRedirect = jest.fn();

jest.mock("react-oidc-context", () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    activeNavigator: mockActiveNavigator,
    signinRedirect: mockSigninRedirect,
    error: null,
  })),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show spinner when loading", async () => {
    mockIsLoading = true;

    render(<ProtectedRoute>Test Content</ProtectedRoute>);

    const loadingSpinner = screen.getByTestId("spinner");

    expect(loadingSpinner).toBeVisible();
    expect(screen.queryByText("Test Content")).toBeNull();
  });

  it("should show children when authenticated", async () => {
    mockIsLoading = false;
    mockIsAuthenticated = true;

    render(<ProtectedRoute>Test Content</ProtectedRoute>);

    const content = screen.getByText("Test Content");

    expect(content).toBeVisible();
  });
});
