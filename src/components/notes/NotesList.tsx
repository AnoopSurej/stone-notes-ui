import { useState } from "react";
import { NoteItem } from "./NoteItem";
import { NoteFormModal } from "./NoteFormModal";
import { SortControl } from "./SortControl";
import { useNotes, useDeleteNote, type Note, type SortBy, type SortDir } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NotesList() {
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const { data: notes, isLoading, error } = useNotes({ sortBy, sortDir });
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
      toast.success("Note deleted successfully");
    } catch (err) {
      console.error("Failed to delete note:", err);
      toast.error("Failed to delete note. Please try again.");
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
        <div className="flex items-center gap-4">
          <SortControl
            sortBy={sortBy}
            sortDir={sortDir}
            onSortByChange={setSortBy}
            onSortDirChange={setSortDir}
          />
          <Button onClick={handleCreateNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {isLoading && <div>Loading notes...</div>}

      {error && (
        <Alert variant="destructive" className="flex items-center gap-2">
          <AlertDescription className="flex-1">
            Failed to load notes. Please try again later.
          </AlertDescription>
        </Alert>
      )}

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
