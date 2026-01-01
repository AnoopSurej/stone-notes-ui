import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NoteFormModal } from "./NoteFormModal";
import type { Note } from "@/hooks/useNotes";

const mockMutateAsync = jest.fn();
const mockCreateNote = {
  mutateAsync: mockMutateAsync,
  isPending: false,
};
const mockUpdateNote = {
  mutateAsync: mockMutateAsync,
  isPending: false,
};

jest.mock("@/hooks/useNotes", () => ({
  useCreateNote: () => mockCreateNote,
  useUpdateNote: () => mockUpdateNote,
}));

jest.mock("react-oidc-context", () => ({
  useAuth: () => ({
    user: { access_token: "test-token" },
    isAuthenticated: true,
  }),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("NoteFormModal", () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync.mockResolvedValue({});
  });

  it("should render in create mode when no note is provided", () => {
    render(
      <NoteFormModal open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper }
    );

    expect(screen.getByText("Create New Note")).toBeInTheDocument();
    expect(screen.getByText("Add a new note to your collection.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create note/i })).toBeInTheDocument();
  });

  it("should render in edit mode when note is provided", () => {
    const note: Note = {
      id: 1,
      title: "Test Note",
      content: "Test Content",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(
      <NoteFormModal open={true} onOpenChange={mockOnOpenChange} note={note} />,
      { wrapper }
    );

    expect(screen.getByText("Edit Note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("should call createNote when submitting in create mode", async () => {
    render(
      <NoteFormModal open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper }
    );

    const titleInput = screen.getByPlaceholderText("Enter note title");
    const contentInput = screen.getByPlaceholderText("Enter note content");
    const submitButton = screen.getByRole("button", { name: /create note/i });

    fireEvent.change(titleInput, { target: { value: "New Note" } });
    fireEvent.change(contentInput, { target: { value: "New Content" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        title: "New Note",
        content: "New Content",
      });
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("should call updateNote when submitting in edit mode", async () => {
    const note: Note = {
      id: 1,
      title: "Old Title",
      content: "Old Content",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(
      <NoteFormModal open={true} onOpenChange={mockOnOpenChange} note={note} />,
      { wrapper }
    );

    const titleInput = screen.getByDisplayValue("Old Title");
    const submitButton = screen.getByRole("button", { name: /save changes/i });

    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 1,
        title: "Updated Title",
        content: "Old Content",
      });
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("should disable buttons when pending", () => {
    mockCreateNote.isPending = true;

    render(
      <NoteFormModal open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper }
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeDisabled();

    mockCreateNote.isPending = false;
  });

  it("should clear form after closing", async () => {
    const { rerender } = render(
      <NoteFormModal open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper }
    );

    const titleInput = screen.getByPlaceholderText("Enter note title");
    fireEvent.change(titleInput, { target: { value: "Test" } });

    rerender(
      <NoteFormModal open={false} onOpenChange={mockOnOpenChange} />
    );

    rerender(
      <NoteFormModal open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByPlaceholderText("Enter note title")).toHaveValue("");
  });
});