import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

export default function SignedOut() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <LogOut className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle>You've been signed out</CardTitle>
          <CardDescription>
            Your session has ended successfully. Sign in again to continue using
            Stone Notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => void auth.signinRedirect()}
            className="w-full"
          >
            Sign In Again
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Thank you for using Stone Notes
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}