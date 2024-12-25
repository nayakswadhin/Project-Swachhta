import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface ForecastInsightsProps {
  data: Array<{ predicted: number; actual?: number }>;
}

export const ForecastInsights: React.FC<ForecastInsightsProps> = ({ data }) => {
  const latestActual = data.find(point => point.actual)?.actual;
  const latestPredicted = data.find(point => point.actual)?.predicted;
  
  const getInsightMessage = () => {
    if (!latestActual || !latestPredicted) return null;
    
    const difference = latestActual - latestPredicted;
    const performanceLevel = Math.abs(difference) <= 2 ? 'on track' : 
                           difference > 0 ? 'exceeding expectations' : 
                           'below target';
    
    return `Performance is ${performanceLevel} with ${Math.abs(difference)}% ${
      difference >= 0 ? 'above' : 'below'
    } predicted levels.`;
  };

  const insightMessage = getInsightMessage();
  
  if (!insightMessage) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2"
    >
      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-700">{insightMessage}</p>
    </motion.div>
  );
};