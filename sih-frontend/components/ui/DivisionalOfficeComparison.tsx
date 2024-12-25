import React, { useState } from "react";
import { ChevronDown, Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";


interface DivisionalOfficeData {
  cleanlinessScore: number;
  createdAt: string;
  energyScore: number;
  greenScore: number;
  lifeScore: number;
  name: string;
  overallScore: number;
  wasteManagementScore?: number;
}

interface DivisionalOffice {
  data: DivisionalOfficeData;
}

interface DivisionalOfficeComparisonProps {
  divisionalOffices: DivisionalOffice[];
  loading: boolean;
}

const DivisionalOfficeComparison: React.FC<DivisionalOfficeComparisonProps> = ({
  divisionalOffices,
  loading,
}) => {
  const [selectedOffice1, setSelectedOffice1] = useState<string>("");
  const [selectedOffice2, setSelectedOffice2] = useState<string>("");

  const office1 = divisionalOffices.find(
    (office) => office.data.name === selectedOffice1
  )?.data;
  const office2 = divisionalOffices.find(
    (office) => office.data.name === selectedOffice2
  )?.data;

  const metrics = [
    { key: "overallScore", label: "Overall Score", icon: "🎯" },
    { key: "cleanlinessScore", label: "Cleanliness Score", icon: "✨" },
    { key: "lifeScore", label: "LiFE Score", icon: "🌱" },
    { key: "energyScore", label: "Energy Score", icon: "⚡" },
    { key: "greenScore", label: "Green Score", icon: "🌿" },
  ];

  const formatScore = (score: number | undefined) => {
    if (score === undefined || score === null) return "N/A";
    return `${(typeof score === "number" ? score : 0).toFixed(1)}%`;
  };

  const getComparisonIcon = (score1: number | undefined, score2: number | undefined) => {
    if (score1 === undefined || score2 === undefined) return <Minus className="h-5 w-5 text-gray-400" />;
    if (score1 > score2) return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    if (score1 < score2) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-gray-400" />;
  };

  const ScoreCard = ({ office, isLeft = true }: { office: DivisionalOfficeData | undefined; isLeft?: boolean }) => {
    if (!office) return (
      <div className="bg-gray-50 rounded-xl p-6 h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">Select a post office to view metrics</p>
      </div>
    );

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 truncate">{office.name}</h3>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{metric.icon}</span>
                <span className="text-sm font-medium text-gray-600">{metric.label}</span>
              </div>
              <span className="text-lg font-semibold text-emerald-600">
                        {formatScore(office[metric.key as keyof DivisionalOfficeData] as number)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <Scale className="h-8 w-8 text-emerald-500" />
          <h2 className="text-3xl font-bold text-gray-800">Divisional Office Comparison</h2>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Selectors */}
          {[
            { value: selectedOffice1, setter: setSelectedOffice1, label: "First Post Office" },
            { value: selectedOffice2, setter: setSelectedOffice2, label: "Second Post Office" },
          ].map((select, idx) => (
            <div key={idx} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {select.label}
              </label>
              <div className="relative">
                <select
                  value={select.value}
                  onChange={(e) => select.setter(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 text-base border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-lg appearance-none bg-white transition-all duration-200 hover:border-emerald-300"
                >
                  <option value="">Select Divisional Office</option>
                  {divisionalOffices.map((office) => (
                    <option key={office.data.name} value={office.data.name}>
                      {office.data.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 relative">
          {/* Comparison Cards */}
          <ScoreCard office={office1} isLeft={true} />
          
          {/* Comparison Indicators */}
          {office1 && office2 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-[2.35rem] bg-white px-4 py-2 rounded-lg shadow-md border border-emerald-100">
              {metrics.map((metric) => (
                <div key={metric.key} className="flex items-center justify-center">
                  {getComparisonIcon(
                    office1[metric.key as keyof DivisionalOfficeData] as number,
                    office2[metric.key as keyof DivisionalOfficeData] as number
                  )}
                </div>
              ))}
            </div>
          )}
          
          <ScoreCard office={office2} isLeft={false} />
        </div>
      </div>
    </div>
  );
};

export default DivisionalOfficeComparison;