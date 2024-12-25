import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NotificationMetricProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  additionalContent?: React.ReactNode;
}

export const NotificationMetric: React.FC<NotificationMetricProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = 'text-gray-600',
  additionalContent
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded">
      <div className="flex items-center">
        <Icon className={`h-4 w-4 mr-2 ${iconColor}`} />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex items-center">
        {value}
        {additionalContent}
      </div>
    </div>
  );
};