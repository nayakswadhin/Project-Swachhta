import React from 'react';
import { Sparkles, Leaf, LineChart, Trophy } from 'lucide-react';
import { PostOfficeMetrics as Metrics } from '@/types/postOffice';
import { cn } from '@/lib/utils';

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  gradient: string;
}

const MetricItem = ({ icon: Icon, label, value, color, gradient }: MetricItemProps) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:transform hover:scale-[1.02]">
    <div className={cn("p-3 rounded-xl shadow-sm", gradient)}>
      <Icon className={cn("h-5 w-5", color)} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

interface PostOfficeMetricsProps {
  metrics: Metrics;
}

export function PostOfficeMetrics({ metrics }: PostOfficeMetricsProps) {
  if (!metrics) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-5">
      <MetricItem
        icon={Sparkles}
        label="Cleanliness"
        value={`${metrics.cleanlinessScore}%`}
        color="text-amber-600"
        gradient="bg-gradient-to-br from-amber-100 to-amber-50"
      />
      <MetricItem
        icon={Leaf}
        label="Green Score"
        value={`${metrics.greenMetricScore}%`}
        color="text-green-600"
        gradient="bg-gradient-to-br from-green-100 to-green-50"
      />
      <MetricItem
        icon={LineChart}
        label="Compliance"
        value={`${metrics.complianceRate}%`}
        color="text-blue-600"
        gradient="bg-gradient-to-br from-blue-100 to-blue-50"
      />
      <MetricItem
        icon={Trophy}
        label="Ranking"
        value={`${metrics.ranking}/${metrics.totalOfficesInArea}`}
        color="text-purple-600"
        gradient="bg-gradient-to-br from-purple-100 to-purple-50"
      />
    </div>
  );
}