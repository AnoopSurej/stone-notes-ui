import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotesPage from "./NotesPage";

const mockSignoutRedirect = jest.fn();

let mockAuth: {
  isLoading: boolean;
  isAuthenticated: boolean;
  signoutRedirect: jest.Mock;
  user: {
    profile: {
      given_name: string;
      family_name: string;
    };
  };
  error?: { message: string };
} = {
  isLoading: false,
  isAuthenticated: true,
  signoutRedirect: mockSignoutRedirect,
  user: {
    profile: {
      given_name: "John",
      family_name: "Doe",
    },
  },
};

jest.mock("react-oidc-context", () => ({
  useAuth: () => mockAuth,
}));

jest.mock("@/components/notes/NotesList", () => ({
  NotesList: () => <div data-testid="notes-list">Notes List</div>,
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe("NotesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth = {
      isLoading: false,
      isAuthenticated: true,
      signoutRedirect: mockSignoutRedirect,
      user: {
        profile: {
          given_name: "John",
          family_name: "Doe",
        },
      },
      error: undefined,
    };
  });

  it("should show loading text when auth is loading", () => {
    mockAuth.isLoading = true;

    render(
      <BrowserRouter>
        <NotesPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Loading authentication...")).toBeInTheDocument();
  });

  it("should show authentication error when there is an error", () => {
    mockAuth.error = { message: "Auth failed" };

    render(
      <BrowserRouter>
        <NotesPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Authentication Error: Auth failed")).toBeInTheDocument();
  });

  it("should render page header with user name", () => {
    render(
      <BrowserRouter>
        <NotesPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Stone Notes")).toBeInTheDocument();
    expect(screen.getByText(/Welcome, John Doe!/)).toBeInTheDocument();
  });

  it("should render NotesList component", () => {
    render(
      <BrowserRouter>
        <NotesPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId("notes-list")).toBeInTheDocument();
  });

  it("should show logout button", () => {
    render(
      <BrowserRouter>
        <NotesPage />
      </BrowserRouter>
    );

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });
});