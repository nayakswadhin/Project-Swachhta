"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { validateLoginForm } from "@/lib/validations/auth";

interface LoginFormData {
  id: string;
  password: string;
}

interface FormErrors {
  id?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<LoginFormData>({
    id: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(formData);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
        variant: "default",
      });
      router.push("/staff-dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      setErrors({ general: errorMessage });

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isLoading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">
              Welcome Back
            </CardTitle>
          </div>
          <CardDescription className="dark:text-gray-400">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm dark:bg-red-900/50 dark:text-red-400">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="id">User ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="id"
                  placeholder="Enter your ID"
                  className={`pl-9 ${
                    errors.id ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  value={formData.id}
                  onChange={handleInputChange("id")}
                  disabled={isDisabled}
                  aria-invalid={!!errors.id}
                  aria-describedby={errors.id ? "id-error" : undefined}
                />
              </div>
              {errors.id && (
                <p id="id-error" className="text-sm text-red-500">
                  {errors.id}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`pl-9 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  disabled={isDisabled}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              type="submit"
              disabled={isDisabled}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="mt-4 text-center text-sm dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-green-600 hover:underline dark:text-green-400 transition-colors duration-200"
              >
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
