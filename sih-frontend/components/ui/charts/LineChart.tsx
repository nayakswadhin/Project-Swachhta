import React from 'react';
import { LineChart as LucideLineChart } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, color}) => {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 flex items-end px-4 pb-4 space-x-1">
        {data.map((point, i) => (
          <div
            key={i}
            className="flex-1 relative group"
          >
            <div
              className={`absolute bottom-0 w-full bg-${color}-500 opacity-20 rounded-t transition-all duration-300 ease-out`}
              style={{ height: `${(point.value / max) * 100}%` }}
            />
            <div
              className={`absolute bottom-0 w-full bg-${color}-500 rounded-t transition-all duration-300 ease-out`}
              style={{ height: '2px' }}
            />
            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity">
              {point.value}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-2 text-xs text-gray-500 border-t">
        {data.map((point, i) => (
          <span key={i}>{point.label}</span>
        ))}
      </div>
    </div>
  );
};

export default LineChart;