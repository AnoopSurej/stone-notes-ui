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

jest.mock("@/hooks/useNotes", () => ({
  useNotes: () => ({
    data: mockNotes,
    isLoading: false,
    error: null,
  }),
  useDeleteNote: () => ({
    mutateAsync: mockDeleteMutate,
    isPending: false,
  }),
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
});
