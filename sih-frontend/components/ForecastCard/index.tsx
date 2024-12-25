import React from "react";
import { ForecastHeader } from "./ForecastHeader";
import { ForecastPoint } from "./ForecastPoint";
import { ForecastSummary } from "./ForecastSummary";
import { ForecastInsights } from "./ForecastInsights";
import Image from "next/image";

interface ForecastPoint {
  month: string;
  predicted: number;
  actual?: number;
}

interface ForecastCardProps {
  data: ForecastPoint[];
  title: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ data, title }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <ForecastHeader title={title} />
      <ForecastSummary data={data} />

      <div className="space-y-4">
        {data.map((point, index) => (
          <ForecastPoint
            key={point.month}
            month={point.month}
            predicted={point.predicted}
            actual={point.actual}
            index={index}
          />
        ))}
      </div>

      <ForecastInsights data={data} />

      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-gray-600">Predicted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-gray-600">Actual</span>
          </div>
        </div>
      </div>
      <img
        src={
          "https://res.cloudinary.com/dzxgf75bh/image/upload/v1733974455/ljntu3z7iyeuii9iy2zh.png "
        }
        className="h-[20rem] w-[20rem]"
      />
    </div>
  );
};

export default ForecastCard;
