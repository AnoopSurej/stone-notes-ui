import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useCreateNote, useUpdateNote, type Note } from "@/hooks/useNotes";

interface NoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: Note;
}

function NoteFormContent({
  note,
  onOpenChange,
}: {
  note?: Note;
  onOpenChange: (open: boolean) => void;
}) {
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const isEditing = !!note;

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateNote.mutateAsync({
          id: note.id,
          title,
          content,
        });
        toast.success("Note updated successfully");
      } else {
        await createNote.mutateAsync({
          title,
          content,
        });
        toast.success("Note created successfully");
      }
      onOpenChange(false);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(`Failed to ${isEditing ? "update" : "create"} note:`, err);
      toast.error(`Failed to ${isEditing ? "update" : "create"} note. Please try again.`);
    }
  };

  const isPending = createNote.isPending || updateNote.isPending;

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Note" : "Create New Note"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Make changes to your note here." : "Add a new note to your collection."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={255}
            placeholder="Enter note title"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            maxLength={10000}
            placeholder="Enter note content"
            className="resize-none"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-24">
          {isPending ? (
            <Spinner className="text-white size-5" />
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Note"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function NoteFormModal({ open, onOpenChange, note }: NoteFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <NoteFormContent key={note?.id ?? "new"} note={note} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
