import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ArrowUpRight, ArrowDownRight, ArrowRight, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

export interface AreaData {
  name: string;
  metrics: MetricProps[];
}

interface ComparisonCardProps {
  title: string;
  areas: Record<string, AreaData>;
}

export function ComparisonCard({ title, areas }: ComparisonCardProps) {
  const areaNames = Object.keys(areas);
  const [selectedArea1, setSelectedArea1] = useState(areaNames[0]);
  const [selectedArea2, setSelectedArea2] = useState(areaNames[1]);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const getAreaPerformanceScore = (area: AreaData) => {
    return Math.round(
      area.metrics.reduce((acc, metric) => acc + parseFloat(metric.value), 0) / area.metrics.length
    );
  };

  const area1Score = getAreaPerformanceScore(areas[selectedArea1]);
  const area2Score = getAreaPerformanceScore(areas[selectedArea2]);
  const scoreDiff = area1Score - area2Score;

  const renderMetric = (metric: MetricProps, areaIndex: number) => {
    const isHovered = hoveredMetric === metric.label;
    
    return (
      <motion.div
        key={metric.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: areaIndex * 0.1 }}
        className={cn(
          "p-4 rounded-lg transition-all duration-200",
          isHovered ? "bg-gray-50" : "bg-white",
          "hover:bg-gray-50 cursor-pointer"
        )}
        onMouseEnter={() => setHoveredMetric(metric.label)}
        onMouseLeave={() => setHoveredMetric(null)}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-gray-600">{metric.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">{metric.value}</span>
            <div className={cn(
              "flex items-center px-2 py-1 rounded-full text-xs font-medium",
              metric.change > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            )}>
              {metric.change > 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {Math.abs(metric.change)}%
            </div>
          </div>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: metric.value }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
              "absolute h-full rounded-full",
              areaIndex === 0 ? "bg-blue-500" : "bg-indigo-500"
            )}
          />
        </div>
        <span className="text-xs text-gray-500 mt-1 inline-block">
          {metric.changeLabel}
        </span>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Maximize2 className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-500 mb-2">Area 1 Performance Score</label>
          <select
            value={selectedArea1}
            onChange={(e) => setSelectedArea1(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
          >
            {areaNames.map((area) => (
              <option key={area} value={area}>{areas[area].name}</option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 tracking-tight">{area1Score}%</div>
              <div className="text-sm text-gray-500">Overall Performance</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-500 mb-2">Area 2 Performance Score</label>
          <select
            value={selectedArea2}
            onChange={(e) => setSelectedArea2(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
          >
            {areaNames.map((area) => (
              <option key={area} value={area}>{areas[area].name}</option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 rounded-lg p-3">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 tracking-tight">{area2Score}%</div>
              <div className="text-sm text-gray-500">Overall Performance</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className={cn(
          "px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm",
          scoreDiff > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        )}>
          {scoreDiff > 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
          <span>
            <span className="font-semibold">{Math.abs(scoreDiff)}%</span> {scoreDiff >= 0 ? "better" : "lower"} overall performance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Individual Metrics</h3>
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {areas[selectedArea1].metrics.map((metric, index) => renderMetric(metric, 0))}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="border-l border-gray-100 pl-8">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Individual Metrics</h3>
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {areas[selectedArea2].metrics.map((metric, index) => renderMetric(metric, 1))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="font-medium">{areas[selectedArea1].name}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="font-medium">{areas[selectedArea2].name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonCard;