"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Leaf, Mail, Lock, User, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { validateRegistrationForm } from '@/lib/validations/auth';
import type { SignupCredentials } from '@/lib/auth';

interface FormErrors {
  name?: string;
  id?: string;
  email?: string;
  password?: string;
  area?: string;
  postOffice?: string;
  phoneno?: string;
  general?: string;
}

export default function Register() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    id: '',
    email: '',
    password: '',
    area: '',
    postOffice: '',
    phoneno: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof SignupCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'phoneno' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateRegistrationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await register(formData);
      toast({
        title: "Registration successful!",
        description: "Your account has been created. Please log in.",
        variant: "default",
      });
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred during registration.";
      
      setErrors({ general: errorMessage });
      
      toast({
        title: "Registration failed",
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
              Create Account
            </CardTitle>
          </div>
          <CardDescription className="dark:text-gray-400">
            Enter your details to register
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
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className={`pl-9 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  disabled={isDisabled}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="id">User ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="id"
                  placeholder="Choose a user ID"
                  className={`pl-9 ${errors.id ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.id}
                  onChange={handleInputChange('id')}
                  disabled={isDisabled}
                  aria-invalid={!!errors.id}
                  aria-describedby={errors.id ? 'id-error' : undefined}
                />
              </div>
              {errors.id && (
                <p id="id-error" className="text-sm text-red-500">
                  {errors.id}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-9 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={isDisabled}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {errors.email}
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
                  placeholder="Choose a password"
                  className={`pl-9 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  disabled={isDisabled}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="area"
                  placeholder="Enter your area"
                  className={`pl-9 ${errors.area ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.area}
                  onChange={handleInputChange('area')}
                  disabled={isDisabled}
                  aria-invalid={!!errors.area}
                  aria-describedby={errors.area ? 'area-error' : undefined}
                />
              </div>
              {errors.area && (
                <p id="area-error" className="text-sm text-red-500">
                  {errors.area}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postOffice">Post Office</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="postOffice"
                  placeholder="Enter your post office"
                  className={`pl-9 ${errors.postOffice ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.postOffice}
                  onChange={handleInputChange('postOffice')}
                  disabled={isDisabled}
                  aria-invalid={!!errors.postOffice}
                  aria-describedby={errors.postOffice ? 'postoffice-error' : undefined}
                />
              </div>
              {errors.postOffice && (
                <p id="postoffice-error" className="text-sm text-red-500">
                  {errors.postOffice}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneno">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneno"
                  type="tel"
                  placeholder="Enter your phone number"
                  className={`pl-9 ${errors.phoneno ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.phoneno || ''}
                  onChange={handleInputChange('phoneno')}
                  disabled={isDisabled}
                  aria-invalid={!!errors.phoneno}
                  aria-describedby={errors.phoneno ? 'phone-error' : undefined}
                />
              </div>
              {errors.phoneno && (
                <p id="phone-error" className="text-sm text-red-500">
                  {errors.phoneno}
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="mt-4 text-center text-sm dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-green-600 hover:underline dark:text-green-400 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}