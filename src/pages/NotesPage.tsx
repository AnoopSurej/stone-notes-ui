import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { NotesList } from "@/components/notes/NotesList";

export default function NotesPage() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Authentication Error: {auth.error.message}</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Stone Notes</h1>
          <p className="text-gray-600">
            Welcome, {auth.user?.profile.given_name}{" "}
            {auth.user?.profile.family_name}!
          </p>
        </div>
        <Button onClick={() => auth.signoutRedirect()}>
          Logout
        </Button>
      </div>

      <NotesList />
    </div>
  );
}
