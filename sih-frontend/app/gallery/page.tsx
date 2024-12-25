"use client"
import React, { useState, useEffect } from 'react';
import GalleryCard from '../../components/GalleryCard';
import GalleryHeader from '../../components/GalleryHeader';

const dummyData = [
  {
    imageUrl: "https://images.unsplash.com/photo-1516831906352-1623190ca036",
    timestamp: "2024-03-14 15:30:22",
    location: "Zone A - North Sector",
    confidence: 95,
    status: 'clean' as const,
    isLive: true
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
    timestamp: "2024-03-14 15:28:15",
    location: "Zone B - East Sector",
    confidence: 88,
    status: 'violation' as const,
    isLive: true
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
    timestamp: "2024-03-14 15:25:44",
    location: "Zone C - West Sector",
    confidence: 92,
    status: 'violation' as const,
    isLive: true
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
    timestamp: "2024-03-14 15:22:30",
    location: "Zone D - South Sector",
    confidence: 97,
    status: 'clean' as const,
    isLive: true
  }
];

export default function Gallery() {
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(dummyData);

  useEffect(() => {
    const filtered = dummyData.filter(item => {
      const matchesZone = selectedZone === 'all' || 
        item.location.toLowerCase().includes(selectedZone.toLowerCase());
      const matchesSearch = !searchQuery ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.timestamp.includes(searchQuery);
      return matchesZone && matchesSearch;
    });
    setFilteredData(filtered);
  }, [selectedZone, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">     
      <main className="container mx-auto px-4 py-8">
        <GalleryHeader
          selectedZone={selectedZone}
          onZoneChange={setSelectedZone}
          onSearch={setSearchQuery}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((item, index) => (
            <div key={index} className="transform transition-all duration-500 hover:scale-[1.02]">
              <GalleryCard {...item} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}