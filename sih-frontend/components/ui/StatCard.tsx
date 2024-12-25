import React from 'react';
import { ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, gradient }) => (
  <div className="relative overflow-hidden bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="absolute inset-0 opacity-5" style={{ background: gradient }} />
    <div className="relative flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          {value}
        </h3>
        <p className="text-sm text-green-600 flex items-center mt-2 font-medium">
          <ArrowUp className="h-4 w-4 mr-1" />
          {trend}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${gradient}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6 text-white' })}
      </div>
    </div>
  </div>
);

export default StatCard;