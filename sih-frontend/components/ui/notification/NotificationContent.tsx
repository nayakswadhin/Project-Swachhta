import React from 'react';
import { Scale, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { WasteNotification } from '@/types/notifications';
import { AlertTriangle } from 'lucide-react';
interface NotificationContentProps {
  notification: WasteNotification;
}

export const NotificationContent: React.FC<NotificationContentProps> = ({ notification }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900">
        New {notification.type} Waste Alert
      </h3>
      
      <div className="space-y-1.5">
        <div className="flex items-center text-sm text-gray-600">
          <Scale className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">Quantity: {notification.size}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <time dateTime={notification.date} className="truncate">
            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
          </time>
        </div>
      </div>

      {notification.isAccidentProne && (
        <div className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">High Risk</span>
        </div>
      )}
    </div>
  );
};