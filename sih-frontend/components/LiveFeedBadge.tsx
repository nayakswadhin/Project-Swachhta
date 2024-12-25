import React from 'react';
import { Wifi } from 'lucide-react';

export default function LiveFeedBadge() {
  return (
    <div className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full animate-pulse">
      <Wifi className="w-4 h-4" />
      <span className="text-sm font-medium">LIVE</span>
    </div>
  );
}