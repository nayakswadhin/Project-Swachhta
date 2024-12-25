import React, { useEffect, useState } from 'react';
import { Bell, Trash2, Leaf, Scale, Percent, Clock, X, AlertTriangle } from 'lucide-react';
import { NotificationMetric } from './NotificationMetric';
import { calculateSeverity, getSeverityColor } from '../utils/severityUtils';
import { formatTimestamp } from '../utils/dateUtils';

interface WasteNotificationProps {
  postOfficeId: string;
  score: number;
  quantity: {
    totalCount: number;
  };
  percentageOrganicWaste: number;
  timestamp: string;
  onClose: () => void;
}

export const WasteNotification: React.FC<WasteNotificationProps> = ({
  postOfficeId,
  score,
  quantity,
  percentageOrganicWaste,
  timestamp,
  onClose,
}) => {
  const severity = calculateSeverity(score);
  const severityColor = getSeverityColor(severity);
  const [postOffice, setPostOffice] = useState('');

  useEffect(() => {
    const fetchPostOfficeData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/post-office/${postOfficeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post office");
        }
        const postOffice = await response.json();
        setPostOffice(postOffice.data.name);
      } catch (error) {
        console.error("Error fetching post office data:", error);
      }
    };

    fetchPostOfficeData();
  }, [postOfficeId]);

  const getSeverityStyles = () => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-gradient-to-br from-white to-red-50';
      case 'medium':
        return 'border-yellow-200 bg-gradient-to-br from-white to-yellow-50';
      default:
        return 'border-green-200 bg-gradient-to-br from-white to-green-50';
    }
  };

  return (
    <div className={`fixed top-[16rem] right-4 w-96 rounded-xl shadow-2xl border-2 ${getSeverityStyles()} p-6 animate-slide-in backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${severity === 'high' ? 'bg-red-100' : severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <AlertTriangle className={`h-6 w-6 ${severity === 'high' ? 'text-red-500' : severity === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Waste Alert</h3>
            <p className="text-sm text-gray-600">Post Office: {postOffice || 'Loading...'}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${severity === 'high' ? 'bg-red-100' : severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
          <NotificationMetric
            icon={Scale}
            label="Cleanliness Score"
            value={score.toFixed(1)}
            iconColor={severity === 'high' ? 'text-red-600' : severity === 'medium' ? 'text-yellow-600' : 'text-green-600'}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <NotificationMetric
              icon={Trash2}
              label="Total Items"
              value={quantity.totalCount}
            />
          </div>

          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <NotificationMetric
              icon={Leaf}
              label="Organic Waste"
              value={percentageOrganicWaste}
              additionalContent={<Percent className="h-3 w-3 ml-1 text-green-600" />}
            />
          </div>

          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <NotificationMetric
              icon={Clock}
              label="Detected At"
              value={formatTimestamp(timestamp)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Severity Level</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
            ${severity === 'high' ? 'bg-red-100 text-red-700' : 
              severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'}`}>
            {severity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WasteNotification;