import React, { useState } from 'react';
import { AlertCircle, Camera, MapPin, Clock, Shield } from 'lucide-react';
import ErrorReportForm from './ErrorReportForm';
import LiveFeedBadge from './LiveFeedBadge';

interface GalleryCardProps {
  imageUrl: string;
  timestamp: string;
  location: string;
  confidence: number;
  status: 'clean' | 'violation';
  isLive?: boolean;
}

export default function GalleryCard({ 
  imageUrl, 
  timestamp, 
  location, 
  confidence, 
  status,
  isLive = false 
}: GalleryCardProps) {
  const [showErrorForm, setShowErrorForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleErrorSubmit = (data: any) => {
    console.log('Error report submitted:', data);
    // Here you would typically send the data to your backend
  };

  return (
    <>
      <div 
        className="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 
          hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt="CCTV Footage" 
            className={`w-full h-64 object-cover transition-transform duration-700
              ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2
            transform transition-transform duration-300 group-hover:scale-110">
            <Camera className="w-5 h-5 text-white" />
          </div>

          {isLive && (
            <div className="absolute top-4 left-4">
              <LiveFeedBadge />
            </div>
          )}

          <div className={`absolute bottom-4 left-4 right-4 transform transition-all duration-300
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex justify-between items-center text-white">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{timestamp}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{location}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium
                ${status === 'clean' ? 'bg-green-500' : 'bg-red-500'}`}>
                {status === 'clean' ? 'Clean Area' : 'Violation Detected'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">{confidence}% confident</span>
            </div>
            
            <button
              onClick={() => setShowErrorForm(true)}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700
                transition-colors duration-300"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Report Issue</span>
            </button>
          </div>
        </div>
      </div>

    </>
  );
}