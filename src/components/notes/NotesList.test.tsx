import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotesList } from "./NotesList";
import type { Note } from "@/hooks/useNotes";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("./NoteItem", () => ({
  NoteItem: ({
    note,
    onEdit,
    onDelete,
  }: {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
  }) => (
    <div data-testid={`note-${note.id}`}>
      <span>{note.title}</span>
      <button onClick={() => onEdit(note)}>Edit</button>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  ),
}));

jest.mock("./NoteFormModal", () => ({
  NoteFormModal: ({ open, note }: { open: boolean; note?: Note | null }) => (
    <div data-testid="note-form-modal">{open && <span>Modal {note ? "Edit" : "Create"}</span>}</div>
  ),
}));

const mockNotes: Note[] = [
  {
    id: 1,
    title: "Note 1",
    content: "Content 1",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    title: "Note 2",
    content: "Content 2",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
];

const mockDeleteMutate = jest.fn();
const mockUseNotes = jest.fn();
const mockUseDeleteNote = jest.fn();

jest.mock("@/hooks/useNotes", () => ({
  useNotes: () => mockUseNotes(),
  useDeleteNote: () => mockUseDeleteNote(),
}));

jest.mock("react-oidc-context", () => ({
  useAuth: () => ({
    user: { access_token: "test-token" },
  }),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("NotesList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn(() => true);
    mockDeleteMutate.mockResolvedValue({});

    // Set default mock return values
    mockUseNotes.mockReturnValue({
      data: mockNotes,
      isLoading: false,
      error: null,
    });
    mockUseDeleteNote.mockReturnValue({
      mutateAsync: mockDeleteMutate,
      isPending: false,
    });
  });

  it("should render list of notes", () => {
    render(<NotesList />, { wrapper });

    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();
  });

  it("should show New Note button", () => {
    render(<NotesList />, { wrapper });

    expect(screen.getByRole("button", { name: /new note/i })).toBeInTheDocument();
  });

  it("should open modal in create mode when New Note is clicked", () => {
    render(<NotesList />, { wrapper });

    const newNoteButton = screen.getByRole("button", { name: /new note/i });
    fireEvent.click(newNoteButton);

    expect(screen.getByText("Modal Create")).toBeInTheDocument();
  });

  it("should open modal in edit mode when Edit is clicked", () => {
    render(<NotesList />, { wrapper });

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(screen.getByText("Modal Edit")).toBeInTheDocument();
  });

  it("should handle delete through DeleteNoteDialog", async () => {
    mockDeleteMutate.mockResolvedValueOnce({});

    render(<NotesList />, { wrapper });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith(1);
    });
  });

  it("should show success toast when deleting note successfully", async () => {
    render(<NotesList />, { wrapper });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Note deleted successfully");
    });
  });

  it("should show error toast when deleting note fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockDeleteMutate.mockRejectedValueOnce(new Error("Network error"));

    render(<NotesList />, { wrapper });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to delete note. Please try again.");
    });

    consoleErrorSpy.mockRestore();
  });

  describe("Error Alert", () => {
    it("should display error alert when fetching notes fails", () => {
      mockUseNotes.mockReturnValueOnce({
        data: null,
        isLoading: false,
        error: new Error("Network error"),
      });

      render(<NotesList />, { wrapper });

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Failed to load notes. Please try again later.")).toBeInTheDocument();
    });

    it("should not display error alert when there is no error", () => {
      render(<NotesList />, { wrapper });

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Failed to load notes. Please try again later.")
      ).not.toBeInTheDocument();
    });

    it("should display error alert with destructive variant", () => {
      mockUseNotes.mockReturnValueOnce({
        data: null,
        isLoading: false,
        error: new Error("Network error"),
      });

      render(<NotesList />, { wrapper });

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("flex", "items-center", "gap-2");
    });

    it("should not display notes when there is an error", () => {
      mockUseNotes.mockReturnValueOnce({
        data: null,
        isLoading: false,
        error: new Error("Network error"),
      });

      render(<NotesList />, { wrapper });

      expect(screen.queryByText("Note 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Note 2")).not.toBeInTheDocument();
    });
  });
});
