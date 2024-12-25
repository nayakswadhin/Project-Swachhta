'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, Lock, Building2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DOLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/do/login', formData);
      localStorage.setItem('doOfficer', JSON.stringify(response.data.do_officer));
      localStorage.setItem('token', response.data.token);
      
      // Animate success state
      toast.success('Login successful!', {
        duration: 2000,
      });
      
      setTimeout(() => {
        router.push('/do/dashboard');
      }, 500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-emerald-50 to-teal-50">
      <motion.div 
        className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="sm:mx-auto sm:w-full sm:max-w-md"
          variants={itemVariants}
        >
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Building2 className="h-12 w-12 text-green-600" />
          </motion.div>
          <motion.h2 
            className="mt-6 text-center text-3xl font-extrabold text-gray-900"
            variants={itemVariants}
          >
            Divisional Officer Login
          </motion.h2>
          <motion.p 
            className="mt-2 text-center text-sm text-gray-600"
            variants={itemVariants}
          >
            Access your dashboard to monitor post office cleanliness
          </motion.p>
        </motion.div>

        <motion.div 
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          variants={itemVariants}
        >
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
            <CardHeader>
              <h3 className="text-lg font-medium text-center text-gray-900">
                Sign in to your account
              </h3>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <CardContent className="space-y-6">
                <motion.div 
                  className="space-y-1"
                  variants={itemVariants}
                  animate={focusedField === 'email' ? { scale: 1.02 } : { scale: 1 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors duration-200 ${
                        focusedField === 'email' ? 'text-green-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 transition-all duration-200 border-gray-200 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-1"
                  variants={itemVariants}
                  animate={focusedField === 'password' ? { scale: 1.02 } : { scale: 1 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-200 ${
                        focusedField === 'password' ? 'text-green-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 transition-all duration-200 border-gray-200 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your password"
                    />
                  </div>
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </motion.div>
                
                <motion.p 
                  className="text-center text-sm text-gray-600"
                  variants={itemVariants}
                >
                  Don't have an account?{' '}
                  <Link 
                    href="/do/register" 
                    className="text-green-600 hover:text-green-500 transition-colors duration-300 hover:underline font-medium"
                  >
                    Register here
                  </Link>
                </motion.p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}