"use client";
import React, { useEffect, useState } from "react";
import {
  Activity,
  Building2,
  Trash2,
  Leaf,
  Recycle,
  TreePine,
  Lightbulb,
  Droplets,
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import GraphCard from "../components/ui/GraphCard";
import InsightsCard from "../components/ui/InsightsCard";
import ForecastCard from "../components/ForecastCard/index";
import MetricsCard from "../components/ui/MetricsCard";
import { DivisionalOfficeSelect } from "@/components/ui/DivisionalOfficeSelect";
import { DateFilter } from "@/components/ui/DateFilter";
import { areaData } from "@/lib/mock-data";
import DivisionalOfficeComparison from "@/components/ui/DivisionalOfficeComparison";
import { useDivisionalOffices } from "../hooks/useDivisionalOffices";
import axios from "axios";

const RegionalOfficeDashboard: React.FC = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("month");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDivisionalOffice, setSelectedDivisionalOffice] =
    useState("all");
  // const { divisionalOffices, loading, error } = useDivisionalOffices();
  const [divisionalOffices, setDivisionalOffices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setcount] = useState(0);
  const [cleaniness, setCleaniness] = useState(0);
  const [wasteManagementScore, setWasteManagementScore] = useState(0);
  const [lifeScore, setLifeScore] = useState(0);
  const [energyScore, setEnergyScore] = useState(0);

  useEffect(() => {
    const fetchDivisionalOffices = async () => {
      // Retrieve the entire Regional Office object from localStorage
      const roOfficerData = localStorage.getItem("roOfficer");

      if (roOfficerData) {
        try {
          // Parse the stored JSON string
          const roOfficer = JSON.parse(roOfficerData);

          // Set loading to true before the request
          setLoading(true);

          await axios
            .post("http://localhost:3000/ro/getalldata", {
              regionalOfficeId: roOfficer._id,
            })
            .then((res) => {
              setCleaniness(res.data.averageScores.cleanlinessScore);
              setWasteManagementScore(
                res.data.averageScores.wasteManagementScore
              );
              setLifeScore(res.data.averageScores.lifeScore);
              setEnergyScore(res.data.averageScores.energyScore);
            })
            .catch((err) => {
              console.log(err);
            });

          // Make the API call
          await axios
            .post("http://localhost:3000/ro/getalldata", {
              regionalOfficeId: roOfficer._id, // Use the _id from the stored Regional Office data
            })
            .then((res) => {
              console.log(res.data.divisionalOffices);
              setDivisionalOffices(res.data.divisionalOffices);
              // setcount(res.data.count)
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
          console.log(divisionalOffices);
          // Update state with the fetched divisional offices
          // Clear any previous errors
          setError(null);
        } catch (err: any) {
          console.error("Error fetching divisional offices:", err);
          setError(
            err.response?.data?.message ||
              "An error occurred while fetching divisional offices"
          );
          setDivisionalOffices([]);
        } finally {
          // Set loading to false
          setLoading(false);
        }
      }
    };

    // Call the fetch function
    fetchDivisionalOffices();
  }, []); // Empty dependency array means this runs once on component mount

  const stats = [
    {
      title: "Cleanliness Score",
      value: `${cleaniness}%`,
      icon: <Trash2 className="h-5 w-5" />,
      trend: "4.5% increase",
      gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
    },
    {
      title: "Active Divisional Offices",
      value: divisionalOffices.length,
      icon: <Building2 className="h-5 w-5" />,
      trend: "12 new this month",
      gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
    },
    {
      title: "Life Score",
      value: `${lifeScore}%`,
      icon: <Leaf className="h-5 w-5" />,
      trend: "2.1% increase",
      gradient: "bg-gradient-to-br from-teal-400 to-emerald-500",
    },
    {
      title: "Alerts Resolved",
      value: "95%",
      icon: <Activity className="h-5 w-5" />,
      trend: "3.2% improvement",
      gradient: "bg-gradient-to-br from-indigo-400 to-purple-500",
    },
  ];

  const lifeMetrics = [
    {
      title: "Waste Mangement Score",
      value: `${wasteManagementScore}%`,
      icon: <Recycle className="h-5 w-5" />,
      trend: "5.3% increase",
      gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    },
    {
      title: "Green Space",
      value: "76%",
      icon: <TreePine className="h-5 w-5" />,
      trend: "3.8% increase",
      gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
    },
    {
      title: "Energy Efficiency",
      value: `${energyScore}%`,
      icon: <Lightbulb className="h-5 w-5" />,
      trend: "6.2% improvement",
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
    },
  ];

  const responseTimeData = [
    { label: "Mon", value: 250 },
    { label: "Tue", value: 220 },
    { label: "Wed", value: 280 },
    { label: "Thu", value: 200 },
    { label: "Fri", value: 180 },
    { label: "Sat", value: 160 },
    { label: "Sun", value: 150 },
  ];

  const frequencyData = [
    { label: "Mon", value: 45 },
    { label: "Tue", value: 52 },
    { label: "Wed", value: 48 },
    { label: "Thu", value: 55 },
    { label: "Fri", value: 59 },
    { label: "Sat", value: 42 },
    { label: "Sun", value: 47 },
  ];

  const sizeData = [
    { label: "Mon", value: 2.5 },
    { label: "Tue", value: 2.8 },
    { label: "Wed", value: 2.6 },
    { label: "Thu", value: 3.0 },
    { label: "Fri", value: 2.9 },
    { label: "Sat", value: 2.7 },
    { label: "Sun", value: 2.4 },
  ];

  const forecastData = [
    { month: "April", predicted: 94, actual: 92 },
    { month: "May", predicted: 96 },
    { month: "June", predicted: 97 },
  ];

  const recommendations = [
    "Implement automated waste segregation systems to improve recycling efficiency",
    "Schedule regular cleanliness audits during peak hours",
    "Deploy IoT sensors for real-time monitoring of air quality and cleanliness metrics",
    "Conduct monthly training sessions on new green practices",
    "Install smart energy meters for better power consumption monitoring",
    "Implement rainwater harvesting systems across facilities",
    "Set up composting units for organic waste management",
    "Organize LiFE awareness workshops for staff members",
  ];

  const handleFilterChange = (filter: string) => {
    setSelectedTimeFilter(filter);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleDivisionalOfficeChange = (divisionalOffice: string) => {
    setSelectedDivisionalOffice(divisionalOffice);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="space-y-6 max-w-7xl mx-auto p-6">
        <div className="relative bg-white p-8 rounded-xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-transparent" />
          <div className="relative space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Swachhta and LiFE RegionalOfficeDashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Monitor cleanliness and green practices across post offices
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <DivisionalOfficeSelect
                  onDivisionalOfficeChange={handleDivisionalOfficeChange}
                  divisionalOffices={divisionalOffices}
                  loading={loading}
                  error={error}
                />
                <DateFilter
                  onFilterChange={handleFilterChange}
                  onDateChange={handleDateChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-500" />
            LiFE Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lifeMetrics.map((metric, index) => (
              <StatCard key={`life-${index}`} {...metric} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <GraphCard title="Cleanliness Trends" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <GraphCard title="Green Practice Adoption" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <MetricsCard type="response" data={responseTimeData} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <MetricsCard type="frequency" data={frequencyData} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <MetricsCard type="size" data={sizeData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InsightsCard score={92} recommendations={recommendations} />
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <ForecastCard
              title="Cleanliness Score Forecast"
              data={forecastData}
            />
          </div>
        </div>

        {/* Post Office Comparison */}
        {/* <DivisionalOfficeComparison
          divisionalOffices={divisionalOffices}
          loading={loading}
        /> */}
      </div>
    </div>
  );
};

export default RegionalOfficeDashboard;
