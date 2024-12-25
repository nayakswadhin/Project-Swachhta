import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

interface ForecastPoint {
  month: string;
  predicted: number;
  actual?: number;
}

interface ForecastCardProps {
  data: ForecastPoint[];
  title: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ data, title }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Next 3 months</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((point, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">{point.month}</span>
              <span className="text-sm font-semibold text-blue-600">{point.predicted}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                style={{ width: `${point.predicted}%` }}
              />
            </div>
            {point.actual && (
              <div
                className="absolute top-1/2 h-4 w-1 bg-green-500 rounded-full transform -translate-y-1/2"
                style={{ left: `${point.actual}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-100 px-2 py-1 rounded text-xs font-medium text-green-700">
                  {point.actual}%
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastCard;