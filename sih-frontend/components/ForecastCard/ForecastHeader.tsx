import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

interface ForecastHeaderProps {
  title: string;
}

export const ForecastHeader: React.FC<ForecastHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="h-4 w-4" />
        <span>Next 3 months</span>
      </div>
    </div>
  );
};