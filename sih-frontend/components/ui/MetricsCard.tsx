import React from 'react';
import { Clock, BarChart2, Database } from 'lucide-react';
import LineChart from './charts/LineChart';

interface MetricsCardProps {
  type: 'response' | 'frequency' | 'size';
  data: Array<{ label: string; value: number }>;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ type, data }) => {
  const configs = {
    response: {
      title: 'Response Time',
      icon: Clock,
      color: 'blue',
      unit: 'ms',
    },
    frequency: {
      title: 'Request Frequency',
      icon: BarChart2,
      color: 'green',
      unit: 'req/min',
    },
    size: {
      title: 'Waste Size',
      icon: Database,
      color: 'purple',
    },
  };

  const config = configs[type];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${config.color}-100`}>
              <config.icon className={`h-5 w-5 text-${config.color}-600`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{config.title}</h3>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              {data[data.length - 1].value}
              <span className="text-sm text-gray-500 ml-1">{config.unit}</span>
            </p>
            <p className="text-sm text-green-600">
              -12% vs last week
            </p>
          </div>
        </div>
      </div>
      <div className="h-48 p-4">
        <LineChart
          data={data}
          title={config.title}
        />
      </div>
    </div>
  );
};

export default MetricsCard;