import { PostOfficea } from '../types/postOffice';

export const postOffices: PostOfficea[] = [
  {
    id: 1,
    name: "Central Post Office",
    location: { lat: 19.0760, lng: 72.8777 },
    cleanlinessScore: 92,
    rank: 1,
    deviation: 2.3,
    lastInspection: "2024-03-15",
    staffCount: 45,
    dailyVisitors: 500
  },
  {
    id: 2,
    name: "East Wing Post",
    location: { lat: 19.0825, lng: 72.8911 },
    cleanlinessScore: 88,
    rank: 2,
    deviation: 1.7,
    lastInspection: "2024-03-14",
    staffCount: 32,
    dailyVisitors: 350
  },
  {
    id: 3,
    name: "South Plaza Post",
    location: { lat: 19.0642, lng: 72.8875 },
    cleanlinessScore: 85,
    rank: 3,
    deviation: 3.1,
    lastInspection: "2024-03-13",
    staffCount: 28,
    dailyVisitors: 280
  },
  {
    id: 4,
    name: "West End Post",
    location: { lat: 19.0728, lng: 72.8654 },
    cleanlinessScore: 83,
    rank: 4,
    deviation: 2.8,
    lastInspection: "2024-03-12",
    staffCount: 25,
    dailyVisitors: 220
  },
  {
    id: 5,
    name: "North Gate Post",
    location: { lat: 19.0891, lng: 72.8789 },
    cleanlinessScore: 81,
    rank: 5,
    deviation: 3.5,
    lastInspection: "2024-03-11",
    staffCount: 22,
    dailyVisitors: 190
  }
];