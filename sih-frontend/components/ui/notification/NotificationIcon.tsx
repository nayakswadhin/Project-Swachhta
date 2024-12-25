import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { NotificationSeverity } from '@/types/notifications';

interface NotificationIconProps {
  severity: NotificationSeverity;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ severity }) => {
  const iconClasses = {
    warning: 'bg-amber-50 text-amber-500',
    danger: 'bg-red-50 text-red-500'
  };

  return (
    <div className={`p-2. mr-3 rounded-full ${iconClasses[severity]}`}>
      {severity === 'danger' ? (
        <AlertTriangle className="h-6 w-6" />
      ) : (
        <Trash2 className="h-6 w-6" />
      )}
    </div>
  );
};