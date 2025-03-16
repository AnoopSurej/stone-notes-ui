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

export default function Signup() {
  return (
    <Card className="w-[400px] space-y-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Create a Stone Notes account</CardDescription>
      </CardHeader>
      <CardContent className="mt-5">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input type="text" id="firstName" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input type="text" id="lastName" placeholder="Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="block justify-center text-center text-sm text-muted-foreground">
        <Button className="w-full mb-2">Sign Up</Button>
        Already have an account?{" "}
        <a href="/login" className="text-primary">
          Login
        </a>
      </CardFooter>
    </Card>
  );
}
