import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email: ", email);
    console.log("Password: ", password);
  };

  return (
    <Card className="w-[400px] space-y-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent className="mt-5">
        <form className="space-y-6" id="login-form" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="block justify-center text-center text-sm text-muted-foreground">
        <Button
          className="w-full mb-2"
          form="login-form"
          disabled={!email || !password}
        >
          Log In
        </Button>
        Don't have an account?{" "}
        <a href="/signup" className="text-primary">
          Sign Up
        </a>
      </CardFooter>
    </Card>
  );
}
