"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Users,
  TreePine,
  Award,
  BookOpen,
  Leaf,
  Mail,
  MessageSquare,
  Recycle,
  Scale,
  Droplets,
  Sun,
  Wind,
  CheckCircle,
  Search,
  Star,
  ArrowRight,
  Calendar,
} from "lucide-react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    wasteManagement: 0,
    energyConservation: 0,
    waterConservation: 0,
    greenPractices: 0,
  });

  const stats = [
    {
      title: "Community Participation",
      value: "2,547",
      icon: Users,
      description: "Active participants",
    },
    {
      title: "Green Initiatives",
      value: "156",
      icon: TreePine,
      description: "Environmental programs",
    },
    {
      title: "Cleanliness Score",
      value: "92%",
      icon: Award,
      description: "Average rating",
    },
    {
      title: "Training Sessions",
      value: "48",
      icon: BookOpen,
      description: "Workshops conducted",
    },
  ];

  const metrics = {
    waste: [
      { label: "Plastic Waste", value: 245, unit: "kg", change: -15 },
      { label: "Paper Waste", value: 890, unit: "kg", change: -25 },
      { label: "E-Waste", value: 56, unit: "kg", change: -8 },
    ],
    environmental: [
      {
        label: "Energy Saved",
        value: 1250,
        unit: "kWh",
        icon: Sun,
        change: 15,
      },
      {
        label: "Water Conserved",
        value: 2800,
        unit: "L",
        icon: Droplets,
        change: 20,
      },
      {
        label: "Carbon Offset",
        value: 450,
        unit: "kg",
        icon: Wind,
        change: 12,
      },
    ],
    compliance: [
      { label: "Cleanliness", value: 95, status: "success" },
      { label: "Waste Management", value: 88, status: "warning" },
      { label: "Green Practices", value: 92, status: "success" },
    ],
  };

  const activities = [
    {
      title: "Community Cleanup Drive",
      date: "March 15, 2024",
      participants: 45,
      image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80",
    },
    {
      title: "Green Office Workshop",
      date: "March 10, 2024",
      participants: 30,
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
    },
    {
      title: "Waste Management Training",
      date: "March 5, 2024",
      participants: 25,
      image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80",
    },
  ];

  const ratingCategories = [
    { id: "cleanliness", label: "Cleanliness Standards" },
    { id: "wasteManagement", label: "Waste Management" },
    { id: "energyConservation", label: "Energy Conservation" },
    { id: "greenPractices", label: "Green Practices" },
  ];

  const handleRatingChange = (
    category: keyof typeof ratings,
    value: number
  ) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
    setSubmitSuccess(false);
  };

  const resetForm = () => {
    setFeedback("");
    setRatings({
      cleanliness: 0,
      wasteManagement: 0,
      energyConservation: 0,
      waterConservation: 0,
      greenPractices: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    const submission = {
      cleanlinessRating: ratings.cleanliness,
      wasteManagementRating: ratings.wasteManagement,
      energyConservation: ratings.energyConservation,
      greenPraticies: ratings.greenPractices,
      comment: feedback,
    };

    try {
      await axios.post("http://localhost:3000/feedback", submission);
      setSubmitSuccess(true);
      resetForm();
    } catch (error) {
      setSubmitError("Failed to submit feedback. Please try again.");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({
    category,
    value,
  }: {
    category: keyof typeof ratings;
    value: number;
  }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingChange(category, star)}
          className={`p-1 rounded-full hover:bg-green-50 transition-colors ${
            star <= value ? "text-green-500" : "text-gray-300"
          }`}
        >
          <Star
            className="h-5 w-5"
            fill={star <= value ? "currentColor" : "none"}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">{value || "-"}/10</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-lg">
                <Mail className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">Public Awareness Dashboard</h1>
            </div>
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Search className="h-5 w-5 text-white/60 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-8 w-8 text-green-600" />
                <span className="text-3xl font-bold text-green-700">
                  {stat.value}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {stat.title}
              </h3>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Waste Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Recycle className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Waste Management
              </h2>
            </div>
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.waste.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-medium">
                    {item.label}
                  </span>
                  <Scale className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {item.value} {item.unit}
                </div>
                <div
                  className={`text-sm font-medium ${
                    item.change < 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.change}% from previous month
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Environmental Impact
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.environmental.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center"
              >
                <item.icon className="h-8 w-8 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.label}
                </h3>
                <p className="text-3xl font-bold text-green-700 mb-1">
                  {item.value} {item.unit}
                </p>
                <p className="text-sm font-medium text-green-600">
                  +{item.change}% improvement
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Scores */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Compliance Scores
            </h2>
          </div>
          <div className="space-y-4">
            {metrics.compliance.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.label}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status === "success"
                      ? "Compliant"
                      : "Needs Attention"}
                  </span>
                </div>
                <div className="text-4xl font-bold text-gray-800">
                  {item.value}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Recent Activities
              </h2>
            </div>
            <button className="flex items-center gap-2 text-green-600 hover:text-green-700">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl overflow-hidden"
              >
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {activity.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600">{activity.date}</span>
                    <span className="text-gray-600">
                      {activity.participants} Participants
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Share Your Feedback
            </h2>
          </div>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
              Thank you for your feedback! Your response has been submitted
              successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Rate Our Performance
              </h3>
              <div className="space-y-6">
                {ratingCategories.map(({ id, label }) => (
                  <div
                    key={id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <label className="w-48 text-gray-700 font-medium">
                      {label}
                    </label>
                    <RatingStars
                      category={id as keyof typeof ratings}
                      value={ratings[id as keyof typeof ratings]}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Additional Comments
              </label>
              <textarea
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  setSubmitSuccess(false);
                }}
                className="w-full p-4 h-32 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Share your detailed feedback about our cleanliness and sustainability initiatives..."
              />
            </div>

            {submitError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="h-5 w-5" />
            <Leaf className="h-5 w-5" />
          </div>
          <p className="text-white/80">
            © 2024 Department of Posts - Swachhta & LiFE Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
