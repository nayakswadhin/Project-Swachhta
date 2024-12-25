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
import { Building2, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import axios from "axios";

interface FormData {
  email: string;
  password: string;
}

export default function DOLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/ro/login",
        formData
      );
      localStorage.setItem(
        "roOfficer",
        JSON.stringify(response.data.regional_officer)
      );
      toast({
        title: "Welcome back!",
        description: "Login successful. Redirecting to dashboard...",
        variant: "default",
      });
      console.log(response);
      router.push("/ro/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description:
          error.response?.data?.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">
              Regional Officer Login
            </CardTitle>
          </div>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-9 border-gray-200 dark:border-gray-700 focus:ring-green-500 focus:border-green-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9 border-gray-200 dark:border-gray-700 focus:ring-green-500 focus:border-green-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600
                text-white font-medium py-2 px-4 rounded-md transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
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
                "Sign in"
              )}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register/regional"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 
                    font-medium hover:underline transition-colors duration-200"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
