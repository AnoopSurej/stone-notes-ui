import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteNoteDialog } from "./DeleteNoteDialog";
import type { Note } from "@/hooks/useNotes";

const mockNote: Note = {
  id: 1,
  title: "Test Note",
  content: "Test Content",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

describe("DeleteNoteDialog", () => {
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render delete button", () => {
    render(
      <DeleteNoteDialog
        note={mockNote}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("should show confirmation dialog when delete is clicked", () => {
    render(
      <DeleteNoteDialog
        note={mockNote}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(
      screen.getByText(/This will permanently delete the note "Test Note"/)
    ).toBeInTheDocument();
  });

  it("should call onConfirm when confirmed", async () => {
    render(
      <DeleteNoteDialog
        note={mockNote}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    // Open dialog
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Wait for dialog to open and find confirm button
    await waitFor(() => {
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    });

    const allDeleteButtons = screen.getAllByRole("button", { name: /delete/i });
    const confirmButton = allDeleteButtons[allDeleteButtons.length - 1]; // Last delete button is in the dialog

    if (confirmButton) {
      fireEvent.click(confirmButton);
      expect(mockOnConfirm).toHaveBeenCalledWith(1);
    }
  });

  it("should disable button when isDeleting is true", () => {
    render(
      <DeleteNoteDialog
        note={mockNote}
        onConfirm={mockOnConfirm}
        isDeleting={true}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toBeDisabled();
  });

  it("should not call onConfirm when cancelled", () => {
    render(
      <DeleteNoteDialog
        note={mockNote}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    // Open dialog
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Cancel
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});