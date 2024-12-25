'use client';

import React from 'react';
import { PostOfficeGrid } from '@/components/PostOffice/PostOfficeGrid';
import { Toaster } from '@/components/ui/toaster';
import { usePostOffices } from '@/hooks/usePostOffices';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Background } from '@/components/layout/Background';

export function PostOfficesClient() {
  const { postOffices, loading, error } = usePostOffices();

  console.log(postOffices);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Background />
      <div className="relative">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PostOfficeGrid postOffices={postOffices} />
        </main>
      </div>
      <Toaster />
    </div>
  );
}