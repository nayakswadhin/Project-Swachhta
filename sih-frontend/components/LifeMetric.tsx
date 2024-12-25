import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LifeMetricProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  additionalContent?: React.ReactNode;
}

export const LifeMetric: React.FC<LifeMetricProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = 'text-emerald-600',
  additionalContent
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-1.5 rounded-full bg-white/80 ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold">{value}</span>
        {additionalContent}
      </div>
    </div>
  );
};