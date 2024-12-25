import React from 'react';
import { Search, Filter, MapPin, Camera } from 'lucide-react';

interface GalleryHeaderProps {
  selectedZone: string;
  onZoneChange: (zone: string) => void;
  onSearch: (query: string) => void;
}

export default function GalleryHeader({ selectedZone, onZoneChange, onSearch }: GalleryHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center space-x-4 mb-6">
        <Camera className="w-8 h-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Live Surveillance Feed</h2>
          <p className="text-sm text-gray-500">Real-time monitoring of city zones</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 
              transition-colors group-hover:text-green-500" />
            <input
              type="text"
              placeholder="Search by location or timestamp..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                focus:ring-2 focus:ring-green-500 focus:border-green-500
                transition-all duration-300 hover:border-green-300
                bg-gray-50 hover:bg-white"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <select
              value={selectedZone}
              onChange={(e) => onZoneChange(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3
                focus:ring-2 focus:ring-green-500 focus:border-green-500
                transition-all duration-300 hover:border-green-300
                bg-gray-50 hover:bg-white cursor-pointer"
            >
              <option value="all">All Zones</option>
              <option value="north">North Sector</option>
              <option value="east">East Sector</option>
              <option value="west">West Sector</option>
              <option value="south">South Sector</option>
            </select>
          </div>
          
          <button className="flex items-center space-x-2 px-6 py-3 border border-gray-200 
            rounded-xl hover:bg-green-50 hover:border-green-300 hover:text-green-600
            transition-all duration-300 bg-gray-50 hover:bg-white">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}