import React from "react";
import {
  BarChart3,
  ThumbsUp,
  Trash2,
  Leaf,
  PieChart,
  Map,
  Zap,
  TreePine,
  Star,
  Sparkles,
  Recycle,
  Camera,
} from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-emerald-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Swachhta and LiFE Analytics Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Surveillance Analytics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-6">
            AI Surveillance Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vehicle Count */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 border-b border-emerald-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900 ml-3">
                    Vehicle Traffic Analysis
                  </h2>
                </div>
                <div className="h-72 bg-gray-50 rounded-lg">
                  <iframe
                    title="Vehicles"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiNzEwYWMzMDQtY2UwMS00NGNiLTk1MDQtYzhhNTljN2Q0OTgzIiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ=="
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </div>

            {/* Public Feedback */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 border-b border-emerald-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <ThumbsUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900 ml-3">
                    Public Feedback Analysis
                  </h2>
                </div>
                <div className="h-72 bg-gray-50 rounded-lg">
                  <iframe
                    title="coloured_feedback"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiYzg3YzdjZjgtNWM2Yi00YzE5LWJmZWItMzI0Yjg3Mjg4M2IwIiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ=="
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </div>

            {/* Waste Analysis */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 border-b border-emerald-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Recycle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900 ml-3">
                    Waste Analysis
                  </h2>
                </div>
                <div className="h-72 bg-gray-50 rounded-lg">
                  <iframe
                    title="SIH"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiNTRjNWRiMmUtZWNmMC00N2UxLWI3NzktMTg5OTdlNGU3NjgzIiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ=="
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Environmental Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-6">
            Environmental Impact Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Organic Waste Analysis */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 border-b border-emerald-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TreePine className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900 ml-3">
                    Organic Waste Analysis
                  </h2>
                </div>
                <div className="h-72 bg-gray-50 rounded-lg">
                  <iframe
                    title="Organic Waste Analysis"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiZTc3NTZlNGItNGM5MS00YWM5LTk2NDktYzg5NjMxMDBiNjEzIiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ%3D%3D&pageName=6cd9b220db6057a02c6b"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </div>

            {/* Waste Type Analysis */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 border-b border-emerald-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Recycle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900 ml-3">
                    Waste Type Analysis
                  </h2>
                </div>
                <div className="h-72 bg-gray-50 rounded-lg">
                  <iframe
                    title="Waste Type Analysis"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiZTc3NTZlNGItNGM5MS00YWM5LTk2NDktYzg5NjMxMDBiNjEzIiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ%3D%3D&pageName=de10510c194972208564"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </div>

            {/* Waste Size Distribution */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 border-b border-emerald-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <PieChart className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900 ml-3">
                    Final Energy Consumption
                  </h2>
                </div>
                <div className="h-72 bg-gray-50 rounded-lg">
                  <iframe
                    title="Final Energy Consumption"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiZDA1ODgyNTktYWRlMS00YTZmLWEzNDYtN2UyODkyYTAzYjM1IiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ%3D%3D"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Monitoring Insights */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-6">
            AI-Powered Monitoring Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Waste Distribution Heatmap */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Map className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900 ml-3">
                    Geographical Data
                  </h2>
                </div>
                <div className="h-96 bg-gray-50 rounded-lg">
                  <iframe
                    title="Waste Distribution Heatmap"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiODc3YzYyZjEtZjJhYy00YmMzLThmY2UtNTk5ZTU0OTJhZjZlIiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ%3D%3D"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </div>
            {/* Organic Waste Heatmap */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Map className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900 ml-3">
                    Organic Waste Distribution
                  </h2>
                </div>
                <div className="h-96 bg-gray-50 rounded-lg">
                  <iframe
                    title="Organic Waste Distribution"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiZGFiNGIyMzktNDYzNy00YjkyLWEwY2UtZGJlODNkNDllMmVhIiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ%3D%3D&pageName=d5818173440e56605a73"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
