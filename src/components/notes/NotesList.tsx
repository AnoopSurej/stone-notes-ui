import { useState } from "react";
import { NoteItem } from "./NoteItem";
import { NoteFormModal } from "./NoteFormModal";
import { useNotes, useDeleteNote, type Note } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NotesList() {
  const { data: notes, isLoading, error } = useNotes();
  const deleteNote = useDeleteNote();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingNote(undefined);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Notes</h2>
        <Button onClick={handleCreateNote}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {isLoading && <div>Loading notes...</div>}

      {error && <div className="text-red-600">Error loading notes: {error.message}</div>}

      {notes && notes.length === 0 && (
        <p className="text-gray-500">No notes yet. Create your first note!</p>
      )}

      <div className="space-y-4">
        {notes?.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            isDeleting={deleteNote.isPending}
          />
        ))}
      </div>

      <NoteFormModal open={isModalOpen} onOpenChange={handleModalClose} note={editingNote} />
    </div>
  );
}
