import { render, screen, fireEvent } from "@testing-library/react";
import { NoteItem } from "./NoteItem";
import type { Note } from "@/hooks/useNotes";

jest.mock("./DeleteNoteDialog", () => ({
  DeleteNoteDialog: ({ note, onConfirm }: { note: Note; onConfirm: (id: number) => void }) => (
    <button onClick={() => onConfirm(note.id)}>Delete Dialog</button>
  ),
}));

const mockNote: Note = {
  id: 1,
  title: "Test Note",
  content: "Test Content\nMultiline",
  createdAt: "2024-01-01T10:30:00",
  updatedAt: "2024-01-01T10:30:00",
};

describe("NoteItem", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render note title and content", () => {
    render(
      <NoteItem note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} isDeleting={false} />
    );

    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText(/Test Content/)).toBeInTheDocument();
  });

  it("should render created date", () => {
    render(
      <NoteItem note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} isDeleting={false} />
    );

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", () => {
    render(
      <NoteItem note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} isDeleting={false} />
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockNote);
  });

  it("should render DeleteNoteDialog", () => {
    render(
      <NoteItem note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} isDeleting={false} />
    );

    expect(screen.getByText("Delete Dialog")).toBeInTheDocument();
  });

  it("should not render content if note has no content", () => {
    const noteWithoutContent = { ...mockNote, content: "" };

    const { container } = render(
      <NoteItem
        note={noteWithoutContent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDeleting={false}
      />
    );

    expect(container.querySelector('[data-slot="card-content"]')).not.toBeInTheDocument();
  });

  it("should preserve whitespace in content", () => {
    render(
      <NoteItem note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} isDeleting={false} />
    );

    const content = screen.getByText(/Test Content/);
    expect(content).toHaveClass("whitespace-pre-wrap");
  });
});
