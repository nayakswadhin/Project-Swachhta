"use client";
import { useState, useEffect } from "react";

export interface PostOffice {
  _id: string;
  areaId: string; // Reference to Area schema (ObjectId as string)
  userId: {
    _id: string; // User's ObjectId
    name: string;
    email: string;
    area: string;
    postOffice: string;
    phoneno: number;
  };
  name: string; // Post Office name
  cleanlinessScore: number; // Min: 0, Max: 100
  lifeScore: number; // Default: 0
  energyScore: number; // Default: 0
  wasteManagementScore: number; // Default: 0
  greenScore: number; // Default: 0
  overallScore: number; // Default: 0
  photoLinks: string[]; // Default: empty array
  createdAt: string; // Timestamps
  updatedAt: string; // Timestamps
}

export function usePostOffices() {
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        const doOfficerData = localStorage.getItem("doOfficer");
        if (!doOfficerData) {
          throw new Error("No divisional office data found");
        }

        const doOfficer = JSON.parse(doOfficerData);
        const token = localStorage.getItem("token");

        // First fetch all post offices for the DO
        const response = await fetch(
          `http://localhost:3000/do/${doOfficer._id}/post-offices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch post offices");
        }

        // Get detailed data for each post office
        const postOfficesList = await Promise.all(
          doOfficer.postOffices.map(async (po: any) => {
            const detailResponse = await fetch(
              `http://localhost:3000/post-office/${po._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!detailResponse.ok) {
              throw new Error(
                `Failed to fetch details for post office ${po._id}`
              );
            }

            return detailResponse.json();
          })
        );

        setPostOffices(postOfficesList);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch post offices"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPostOffices();
  }, []);

  return { postOffices, loading, error };
}
