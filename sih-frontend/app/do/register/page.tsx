'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Building2, Mail, Phone, MapPin, User, KeyRound, Briefcase, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DORegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    doCode: '',
    name: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    officerInCharge: {
      name: '',
      email: '',
      phone: '',
      password: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/do/register', formData);
      toast.success('Registration successful!', {
        duration: 2000,
      });
      setTimeout(() => {
        router.push('/do/login');
      }, 500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
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

  const renderInput = (
    section: string,
    field: string,
    icon: React.ElementType,
    type: string = 'text',
    placeholder?: string
  ) => {
    const Icon = icon;
    const fullName = section ? `${section}.${field}` : field;
    const value = section ? formData[section as keyof typeof formData][field] : formData[field as keyof typeof formData];

    return (
      <motion.div 
        className="space-y-2 group"
        variants={itemVariants}
        animate={focusedField === fullName ? { scale: 1.02 } : { scale: 1 }}
      >
        <label 
          htmlFor={fullName}
          className="block text-sm font-medium text-gray-700 capitalize transition-colors group-hover:text-green-600"
        >
          {field.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        <div className="relative">
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
            focusedField === fullName ? 'text-green-500' : 'text-gray-400'
          }`} />
          <Input
            id={fullName}
            name={fullName}
            type={type}
            required
            value={value}
            onChange={handleChange}
            onFocus={() => setFocusedField(fullName)}
            onBlur={() => setFocusedField(null)}
            className="pl-10 transition-all duration-200 border-gray-200 focus:ring-green-500 focus:border-green-500"
            placeholder={placeholder || `Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-emerald-50 to-teal-50">
      <motion.div 
        className="py-12 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="sm:mx-auto sm:w-full sm:max-w-2xl"
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
            Divisional Office Registration
          </motion.h2>
          <motion.p 
            className="mt-2 text-center text-sm text-gray-600"
            variants={itemVariants}
          >
            Register your divisional office to start monitoring post offices
          </motion.p>
        </motion.div>

        <motion.div 
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl"
          variants={itemVariants}
        >
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
            <CardHeader>
              <h3 className="text-lg font-medium text-center text-gray-900">Create your account</h3>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-8">
                {/* Basic Information */}
                <motion.div className="grid gap-4" variants={itemVariants}>
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {renderInput('', 'doCode', Building2)}
                    {renderInput('', 'name', Briefcase)}
                  </div>
                </motion.div>

                {/* Location Information */}
                <motion.div className="grid gap-4" variants={itemVariants}>
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Location Details
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {renderInput('location', 'address', MapPin)}
                    {renderInput('location', 'city', MapPin)}
                    {renderInput('location', 'state', MapPin)}
                    {renderInput('location', 'pincode', MapPin)}
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div className="grid gap-4" variants={itemVariants}>
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {renderInput('contact', 'email', Mail, 'email')}
                    {renderInput('contact', 'phone', Phone)}
                  </div>
                </motion.div>

                {/* Officer Information */}
                <motion.div className="grid gap-4" variants={itemVariants}>
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Officer in Charge Details
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {renderInput('officerInCharge', 'name', User)}
                    {renderInput('officerInCharge', 'email', Mail, 'email')}
                    {renderInput('officerInCharge', 'phone', Phone)}
                    {renderInput('officerInCharge', 'password', KeyRound, 'password')}
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
                        Registering...
                      </div>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </motion.div>
                
                <motion.p 
                  className="text-center text-sm text-gray-600"
                  variants={itemVariants}
                >
                  Already have an account?{' '}
                  <Link 
                    href="/do/login" 
                    className="text-green-600 hover:text-green-500 transition-colors duration-300 hover:underline font-medium"
                  >
                    Sign in here
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