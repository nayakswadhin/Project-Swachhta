'use client';

import React from 'react';
import { Building2, Search, Filter } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white/40 backdrop-blur-md border-b border-green-100/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-green-800 to-emerald-700 bg-clip-text text-transparent">
                Post Offices
              </h1>
              <p className="text-sm text-green-600">Manage and monitor post office performance</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              <input
                type="text"
                placeholder="Search post offices..."
                className="pl-10 pr-4 py-2 rounded-lg bg-white/50 border border-green-100 focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-sm placeholder-green-400"
              />
            </div>
            <button className="p-2 rounded-lg bg-white/50 border border-green-100 hover:bg-white/70 transition-colors">
              <Filter className="h-4 w-4 text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}