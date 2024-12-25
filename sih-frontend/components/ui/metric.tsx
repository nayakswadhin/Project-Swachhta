import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

export interface MetricProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

export function Metric({ label, value, change, changeLabel }: MetricProps) {
  const isPositive = change >= 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-lg font-semibold">{value}</span>
      </div>
      <div className="flex items-center space-x-1">
        {isPositive ? (
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500">{changeLabel}</span>
      </div>
    </div>
  );
}