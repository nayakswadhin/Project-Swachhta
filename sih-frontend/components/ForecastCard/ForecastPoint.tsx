import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ForecastPointProps {
  month: string;
  predicted: number;
  actual?: number;
  index: number;
}

export const ForecastPoint: React.FC<ForecastPointProps> = ({
  month,
  predicted,
  actual,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{month}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900">
            {predicted}%
          </span>
          {actual && (
            <span className="text-sm font-medium text-emerald-700">
              {actual}%
            </span>
          )}
        </div>
      </div>
      
      <div className="relative h-2 bg-gray-100 rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${predicted}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            "bg-blue-600",
            "transition-colors duration-200"
          )}
        />
        
        {actual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 transform -translate-y-1/2"
            style={{ left: `${actual}%` }}
          >
            <div className="h-4 w-0.5 bg-emerald-600" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};