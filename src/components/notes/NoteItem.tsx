import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteNoteDialog } from "./DeleteNoteDialog";
import { type Note } from "@/hooks/useNotes";

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export function NoteItem({ note, onEdit, onDelete, isDeleting }: NoteItemProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{note.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(note)}>
              Edit
            </Button>
            <DeleteNoteDialog note={note} onConfirm={onDelete} isDeleting={isDeleting} />
          </div>
        </div>
      </CardHeader>
      {note.content && (
        <CardContent>
          <p className="whitespace-pre-wrap">{note.content}</p>
        </CardContent>
      )}
      <CardFooter>
        <CardDescription>Created: {new Date(note.createdAt).toLocaleString()}</CardDescription>
      </CardFooter>
    </Card>
  );
}
