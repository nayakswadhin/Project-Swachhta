import React from 'react';
import { Recycle, Trash2, Scale, Percent, Clock, X, AlertTriangle, Box } from 'lucide-react';
import { LifeMetric } from './LifeMetric';
import { LifeNotificationData } from '../types/life';
import { formatDistanceToNow } from 'date-fns';

interface LifeNotificationProps {
  notification: LifeNotificationData;
  postOfficeName: string;
  onClose: () => void;
}

export const LifeNotification: React.FC<LifeNotificationProps> = ({
  notification,
  postOfficeName,
  onClose
}) => {
  const { lifeScore, parameters } = notification;
  const severity = lifeScore < 50 ? 'high' : lifeScore < 75 ? 'medium' : 'low';

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
    <div className={`fixed top-4 right-4 w-96 rounded-xl shadow-2xl border-2 ${getSeverityStyles()} p-6 animate-slide-in backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            severity === 'high' ? 'bg-red-100' : 
            severity === 'medium' ? 'bg-yellow-100' : 
            'bg-green-100'
          }`}>
            <AlertTriangle className={`h-6 w-6 ${
              severity === 'high' ? 'text-red-500' : 
              severity === 'medium' ? 'text-yellow-500' : 
              'text-green-500'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">LiFE Score Update</h3>
            <p className="text-sm text-gray-600">{postOfficeName}</p>
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
        <div className={`p-4 rounded-lg ${
          severity === 'high' ? 'bg-red-100' : 
          severity === 'medium' ? 'bg-yellow-100' : 
          'bg-green-100'
        }`}>
          <LifeMetric
            icon={Scale}
            label="LiFE Score"
            value={lifeScore.toFixed(1)}
            iconColor={
              severity === 'high' ? 'text-red-600' : 
              severity === 'medium' ? 'text-yellow-600' : 
              'text-green-600'
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <LifeMetric
              icon={Trash2}
              label="Plastic Amount"
              value={parameters.plasticAmount}
              additionalContent={<span className="ml-1 text-sm">items</span>}
            />
          </div>

          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <LifeMetric
              icon={Recycle}
              label="Recyclable Waste"
              value={parameters.recyclableWaste}
              additionalContent={<Percent className="h-3 w-3 ml-1 text-emerald-600" />}
            />
          </div>

          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <LifeMetric
              icon={Box}
              label="Bin Count"
              value={parameters.binCount}
            />
          </div>

          <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <LifeMetric
              icon={Clock}
              label="Updated"
              value={formatDistanceToNow(new Date(parameters.timestamp), { addSuffix: true })}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Area</span>
          <span className="text-sm font-medium">{parameters.area}</span>
        </div>
      </div>
    </div>
  );
};