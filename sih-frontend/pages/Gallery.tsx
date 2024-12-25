import React from 'react';
import GalleryCard from '../components/GalleryCard';

const dummyData = [
  {
    imageUrl: "https://images.unsplash.com/photo-1516831906352-1623190ca036",
    timestamp: "2024-03-14 15:30:22",
    location: "Zone A - North Sector"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
    timestamp: "2024-03-14 15:28:15",
    location: "Zone B - East Sector"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
    timestamp: "2024-03-14 15:25:44",
    location: "Zone C - West Sector"
  }
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-800 mb-8">
          CCTV Surveillance Gallery
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyData.map((item, index) => (
            <GalleryCard
              key={index}
              imageUrl={item.imageUrl}
              timestamp={item.timestamp}
              location={item.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
}