"use client"
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  PlayCircle,
  Leaf,
  FileText,
  CheckCircle,
  Clock,
  Search,
  Filter,
  User,
  Bell,
  Lightbulb,
  Video,
  ArrowRight,
  Calendar,
  TrendingUp,
  Star,
  BarChart,
  BookMarked
} from 'lucide-react';

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentTip, setCurrentTip] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const stats = [
    { label: 'Courses Completed', value: '12', icon: <BookMarked className="w-6 h-6 text-emerald-500" /> },
    { label: 'Hours Learned', value: '48', icon: <Clock className="w-6 h-6 text-blue-500" /> },
    { label: 'Current Streak', value: '5 days', icon: <TrendingUp className="w-6 h-6 text-purple-500" /> },
    { label: 'Achievements', value: '8', icon: <Star className="w-6 h-6 text-yellow-500" /> }
  ];

  const dailyTips = [
    {
      title: "Eco-friendly Packaging",
      content: "Use recycled paper and biodegradable materials for packaging",
      icon: <Leaf className="w-6 h-6 text-green-500" />
    },
    {
      title: "Energy Conservation",
      content: "Switch off equipment during lunch breaks to save power",
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />
    },
    {
      title: "Digital First Approach",
      content: "Use digital documentation to reduce paper waste",
      icon: <FileText className="w-6 h-6 text-blue-500" />
    }
  ];

  const trainingVideos = [
    {
      title: "Proper Waste Segregation",
      duration: "5:30",
      thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
      views: "1.2k",
      rating: 4.8
    },
    {
      title: "Energy Saving Best Practices",
      duration: "4:45",
      thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
      views: "890",
      rating: 4.5
    },
    {
      title: "Green Office Guidelines",
      duration: "6:15",
      thumbnail: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=800",
      views: "2.1k",
      rating: 4.9
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % dailyTips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const courses = [
    {
      id: 1,
      title: "Swachhta Fundamentals",
      duration: "2 hours",
      modules: 4,
      progress: 25,
      category: "cleanliness",
      level: "Beginner",
      rating: 4.8,
      students: 1234,
      image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800",
      description: "Learn the basic principles of maintaining cleanliness in post office environments.",
      chapters: [
        "Introduction to Swachhta",
        "Daily Cleaning Protocols",
        "Waste Management",
        "Assessment and Reporting"
      ]
    },
    {
      id: 2,
      title: "Green Office Practices",
      duration: "1.5 hours",
      modules: 3,
      progress: 60,
      category: "sustainability",
      level: "Intermediate",
      rating: 4.6,
      students: 856,
      image: "https://images.unsplash.com/photo-1542089363-bba089ffaa25?auto=format&fit=crop&q=80&w=800",
      description: "Implement sustainable practices in your post office operations.",
      chapters: [
        "Energy Conservation",
        "Paper Waste Reduction",
        "Green Office Guidelines"
      ]
    },
    {
      id: 3,
      title: "LiFE Mission Implementation",
      duration: "2.5 hours",
      modules: 5,
      progress: 40,
      category: "life",
      level: "Advanced",
      rating: 4.9,
      students: 2341,
      image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800",
      description: "Master the Lifestyle for Environment practices for postal services.",
      chapters: [
        "LiFE Mission Overview",
        "Sustainable Operations",
        "Resource Management",
        "Community Engagement",
        "Impact Assessment"
      ]
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || course.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalProgress = courses.reduce((acc, course) => acc + course.progress, 0) / courses.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-lg">
              <GraduationCap className="w-8 h-8 text-blue-700" />
            </div>
            <h1 className="text-2xl font-bold">Post Office Training Portal</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowNotification(!showNotification)}
                className="relative p-2 hover:bg-blue-600 rounded-full transition-colors"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Tip Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between text-white">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Tip of the Day
              </h3>
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="font-medium text-xl mb-1">{dailyTips[currentTip].title}</h4>
                  <p className="text-blue-100">{dailyTips[currentTip].content}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {dailyTips.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentTip === index ? 'bg-white scale-125' : 'bg-blue-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Featured Videos Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Training Videos</h2>
            <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainingVideos.map((video, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg">{video.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {video.duration}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm">{video.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transform transition-all duration-300 hover:scale-110">
                    <PlayCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Learning Journey</h2>
              <p className="text-gray-600">Master Swachhta and LiFE practices for a better postal service environment</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <Award className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-700 font-medium">Overall Progress</span>
                <span className="text-blue-800 font-bold">{Math.round(totalProgress)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 font-medium">Weekly Target</span>
                <span className="text-green-800 font-bold">80%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: '80%' }}
                />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-700 font-medium">Achievements</span>
                <span className="text-purple-800 font-bold">8/10</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: '80%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'cleanliness', 'sustainability', 'life'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  selectedFilter === filter 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600">
                  {course.level}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-600 font-medium">{course.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.modules} modules
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {course.students.toLocaleString()} students
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {course.chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                      {chapter}
                    </div>
                  ))}
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Course Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCourse(course.id)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center font-medium"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No courses found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;