import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function HomePage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/notes");
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center px-4 -translate-y-16">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <img src="/stone.svg" alt="Stone Notes" className="h-full w-full" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Stone Notes
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your secure, simple note-taking companion.
        </p>
        <Button
          size="lg"
          onClick={() => void auth.signinRedirect()}
          className="text-lg px-8 py-6"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
