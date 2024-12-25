import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForecastSummaryProps {
  data: Array<{ predicted: number; actual?: number }>;
}

export const ForecastSummary: React.FC<ForecastSummaryProps> = ({ data }) => {
  const averagePredicted = Math.round(
    data.reduce((acc, curr) => acc + curr.predicted, 0) / data.length
  );
  
  const trend = data[data.length - 1].predicted - data[0].predicted;
  const isPositive = trend >= 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-3 gap-4 mb-6 mt-4"
    >
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-600 mb-1">Average</div>
        <div className="text-xl font-semibold text-gray-900">{averagePredicted}%</div>
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-600 mb-1">Trend</div>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-xl font-semibold ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-600 mb-1">Target</div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span className="text-xl font-semibold text-blue-600">
            {Math.max(...data.map(d => d.predicted))}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};