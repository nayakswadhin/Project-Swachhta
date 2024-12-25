import React from 'react';
import { Maximize2 } from 'lucide-react';

interface GraphCardProps {
  title: string;
  children?: React.ReactNode;
}

const GraphCard: React.FC<GraphCardProps> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Maximize2 className="h-5 w-5 text-gray-500" />
      </button>
    </div>
    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
      {children || (
        <div className="text-center">
          <p className="text-gray-500 mb-2">Power BI visualization will be embedded here</p>
          <p className="text-sm text-gray-400">Loading visualization...</p>
        </div>
      )}
    </div>
  </div>
);

export default GraphCard;