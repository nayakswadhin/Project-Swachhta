import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Leaf,
  Mail,
  MapPin,
  Award,
  BarChart,
  Building2,
  Users,
  Globe,
  UserCircle,
  Building,
  Lock,
} from "lucide-react";
import { DOLoginButton } from "../components/auth/DOLoginButton";

const officerTypes = [
  {
    title: "Post Office",
    icon: (
      <Building className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" />
    ),
    loginHref: "/login",
    signupHref: "/register",
    description: "Access post office management dashboard",
  },
  {
    title: "Divisional Officer",
    icon: (
      <UserCircle className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" />
    ),
    loginHref: "/do/login",
    signupHref: "/do/register",
    description: "Manage divisional operations",
  },
  {
    title: "Regional Officer",
    icon: (
      <Building2 className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" />
    ),
    loginHref: "/login/regional",
    signupHref: "/ro/register",
    description: "Regional monitoring and control",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="animate-float"
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                background: `rgba(${Math.random() * 50 + 200}, 255, ${
                  Math.random() * 50 + 200
                }, 0.1)`,
                borderRadius: "50%",
                animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Buttons */}
      <div className="absolute top-6 right-6 z-10 animate-fade-in flex space-x-4">
        <DOLoginButton />
        <Link href="/public-dashboard">
          <Button className="bg-green-600/90 hover:bg-green-700 text-white font-medium flex items-center justify-center space-x-2 transform hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl py-3 px-6">
            <BarChart className="h-4 w-4" />
            <span>Public Awareness Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 py-16 min-h-screen flex items-center">
        <div className="flex flex-col items-center justify-center space-y-16 text-center w-full">
          {/* Hero section */}
          <div className="space-y-8 pt-8">
            <div className="flex items-center justify-center space-x-4 animate-fade-in">
              <Leaf className="h-16 w-16 text-green-600 dark:text-green-400 transform hover:rotate-12 transition-transform" />
              <h1 className="text-6xl font-bold text-green-800 dark:text-green-100">
                Swachhta & LiFE
              </h1>
            </div>
            <p className="max-w-2xl mx-auto text-xl text-green-700 dark:text-green-200 animate-fade-in-up">
              Empowering post offices with AI-powered monitoring for cleanliness
              and sustainable practices
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full animate-fade-in-up delay-200">
            {[
              {
                icon: <Mail className="h-10 w-10 text-green-600" />,
                title: "Smart Monitoring",
                description: "AI-powered cleanliness tracking system",
              },
              {
                icon: <MapPin className="h-10 w-10 text-green-600" />,
                title: "Location Tracking",
                description: "Real-time post office monitoring",
              },
              {
                icon: <Award className="h-10 w-10 text-green-600" />,
                title: "Performance Metrics",
                description: "Detailed cleanliness analytics",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-3d flex flex-col items-center space-y-4 p-8 rounded-xl backdrop-blur-sm bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <div className="transform transition-transform hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
                  {feature.title}
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Authentication Section */}
          <div className="w-full max-w-6xl animate-fade-in-up delay-300 px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
                Access Your Dashboard
              </h2>
              <p className="text-green-600 dark:text-green-300 max-w-2xl mx-auto">
                Select your role to access specialized features and management
                tools
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {officerTypes.map((officer, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/30 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/30 shadow-lg hover:shadow-2xl backdrop-blur-sm"
                >
                  <div className="p-8 space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500" />
                      <div className="relative flex justify-center text-green-600 dark:text-green-400">
                        {officer.icon}
                      </div>
                    </div>

                    <div className="space-y-2 text-center">
                      <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
                        {officer.title}
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        {officer.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Link href={officer.loginHref} className="block">
                        <Button className="w-full group relative overflow-hidden bg-green-600 hover:bg-green-700 text-white">
                          <span className="relative z-10 flex items-center justify-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Login
                          </span>
                          <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        </Button>
                      </Link>
                      <Link href={officer.signupHref} className="block">
                        <Button
                          variant="outline"
                          className="w-full group relative overflow-hidden border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            Sign Up
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
