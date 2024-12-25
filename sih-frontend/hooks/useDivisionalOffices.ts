"use client";
import { useState, useEffect } from "react";

export interface DivisionalOffice {
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
  name: string; // divisional Office name
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

export function useDivisionalOffices() {
  const [divisionalOffices, setDivisionalOffices] = useState<
    DivisionalOffice[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDivisionalOffices = async () => {
      try {
        const roOfficerData = localStorage.getItem("roOfficer");
        if (!roOfficerData) {
          throw new Error("No divisional office data found");
        }

        const roOfficer = JSON.parse(roOfficerData);
        const token = localStorage.getItem("token");

        // First fetch all divisional offices for the ro
        const response = await fetch(
          `http://localhost:3000/ro/${roOfficer._id}/divisional-offices`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response", response);

        if (!response.ok) {
          throw new Error("Failed to fetch divisional offices");
        }

        // Get detailed data for each divisional office
        const divisonalOfficesList = await Promise.all(
          roOfficer.divisionalOffices.map(async (po: any) => {
            const detailResponse = await fetch(
              `http://localhost:3000/do/${po._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!detailResponse.ok) {
              throw new Error(
                `Failed to fetch details for divisional office ${po._id}`
              );
            }

            return detailResponse.json();
          })
        );

        setDivisionalOffices(divisonalOfficesList);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch divisional offices"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDivisionalOffices();
  }, []);

  return { divisionalOffices, loading, error };
}
