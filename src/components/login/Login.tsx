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
import { FormEvent, useState } from "react";
import { useLoginUser } from "@/hooks/useLoginUser";
import { Spinner } from "@/components/ui/spinner";

export type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormErrors = {
  email?: string;
  password?: string;
};

export default function Login() {
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const { mutate: loginUser, isPending, isError } = useLoginUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id as keyof LoginFormErrors]) {
      setErrors((prev: LoginFormErrors) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    console.log("Here!");
    const newErrors: LoginFormErrors = {};
    if (!loginFormData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginFormData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!loginFormData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginUser(loginFormData, {
      onSuccess: (response) => {
        console.log("Success:", response);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Card className="w-[400px] space-y-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 mx-4 p-1 text-sm rounded text-center mb-0">
          An error occurred during registration. Please try again.
        </div>
      )}
      <CardContent className="mt-5">
        <form className="space-y-6" id="login-form" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Username</Label>
            <Input
              type="text"
              id="email"
              placeholder="Enter your email"
              value={loginFormData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              onChange={handleChange}
              value={loginFormData.password}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="block justify-center text-center text-sm text-muted-foreground">
        <Button className="w-full mb-2" form="login-form">
          {isPending ? (
            <Spinner size={"small"} className="text-white"/>
          ) : (
            "Log in"
          )}
        </Button>
        Don't have an account?{" "}
        <a href="/signup" className="text-primary">
          Sign Up
        </a>
      </CardFooter>
    </Card>
  );
}
