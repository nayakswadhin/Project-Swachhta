import React from 'react';
import { Lightbulb, ChevronRight, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface InsightProps {
  score: number;
  recommendations: string[];
}

const InsightsCard: React.FC<InsightProps> = ({ score, recommendations }) => {
  const getScoreCategory = (score: number) => {
    if (score < 70) return 'Needs Improvement';
    if (score < 85) return 'Good';
    return 'Excellent';
  };

  const getScoreColor = (score: number) => {
    if (score < 70) return 'text-red-600 bg-red-50 border-red-200';
    if (score < 85) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  const getScoreIcon = (score: number) => {
    if (score < 70) return <AlertTriangle className="h-5 w-5" />;
    if (score < 85) return <TrendingUp className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  const priorityRecommendations = recommendations.slice(0, 4);
  const otherRecommendations = recommendations.slice(4);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Actionable Insights</h2>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 border ${getScoreColor(score)}`}>
          {getScoreIcon(score)}
          <span className="font-medium">{getScoreCategory(score)}</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <Target className="h-5 w-5 text-gray-500" />
            <span className="text-2xl font-bold text-gray-800">{score}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
            Priority Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priorityRecommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:border-emerald-200 transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 font-medium">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {otherRecommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Additional Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherRecommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightsCard;