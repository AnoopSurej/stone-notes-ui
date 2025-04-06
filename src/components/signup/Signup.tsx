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
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "sonner";
import { useRegisterUser } from "@/hooks/useRegisterUser";

export type SignupFormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
type SignupFormErrors = {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
};

export default function Signup() {
  const navigate = useNavigate();
  const [signupFormData, setSignupFormData] = useState<SignupFormData>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignupFormErrors>({});

  const { mutate: registerUser, isPending, isError, error } = useRegisterUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id as keyof SignupFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: SignupFormErrors = {};

    if (!signupFormData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupFormData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!signupFormData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!signupFormData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!signupFormData.password) {
      newErrors.password = "Password is required";
    } else if (signupFormData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (signupFormData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    registerUser(signupFormData, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: () => {
        console.log(error);
      },
    });
  };

  return (
    <>
      <Toaster richColors />
      <Card className="w-[400px] space-y-4 gap-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Create a Stone Notes account</CardDescription>
        </CardHeader>

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 mx-4 p-1 text-sm rounded text-center mb-0">
            An error occurred during registration. Please try again.
          </div>
        )}

        <CardContent className="mt-5">
          <form className="space-y-6" onSubmit={handleSubmit} id="signup-form">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="text"
                id="email"
                placeholder="m@example.com"
                value={signupFormData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                placeholder="John"
                value={signupFormData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                placeholder="Doe"
                value={signupFormData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                value={signupFormData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="block justify-center text-center text-sm text-muted-foreground">
          <Button
            className="w-full mb-2"
            disabled={isPending}
            form="signup-form"
          >
            {isPending ? (
              <Spinner size={"small"} className="text-white" />
            ) : (
              "Sign Up"
            )}
          </Button>
          Already have an account?{" "}
          <a href="/login" className="text-primary">
            Login
          </a>
        </CardFooter>
      </Card>
    </>
  );
}
