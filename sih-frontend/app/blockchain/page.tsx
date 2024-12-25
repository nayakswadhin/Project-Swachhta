"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Shield,
  FileText,
  ArrowLeft,
  Database,
  CheckCircle,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Location {
  area: string;
  postOffice: string;
}

interface TypeOfWaste {
  plastic: number;
  biodegradable: number;
  metal: number;
  paper: number;
  cardboard: number;
  glass: number;
}

interface WasteRecord {
  _id: string;
  postOfficeId: string;
  location: Location;
  timestamp: string;
  typeOfWaste: TypeOfWaste;
  sizeOfWaste: number;
  photolink: string;
}

const BlockchainData = () => {
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get<WasteRecord[]>(
          "http://localhost:3000/api/data"
        );
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching waste records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = records.filter(
    (record) =>
      record.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.postOffice
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      Object.keys(record.typeOfWaste).some((type) =>
        type.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const formatWasteTypes = (waste: TypeOfWaste): string => {
    return Object.entries(waste)
      .filter(([_, value]) => value > 0)
      .map(([type, value]) => `${type}: ${value}`)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-green-100">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-green-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-8 w-8 text-green-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Waste Management Records
                </h1>
                <p className="text-gray-600">
                  Comprehensive waste tracking data
                </p>
              </div>
            </div>
            <Link href="/staff-dashboard">
              <Button
                variant="outline"
                className="gap-2 border-2 border-green-600 hover:bg-green-50"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                placeholder="Search by location or waste type..."
                className="pl-10 border-2 border-green-600 bg-white/90"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-4 border-2 border-green-600 bg-white/90">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Records</span>
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {records.length}
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Records List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-green-600"
        >
          <ScrollArea className="h-[600px] rounded-xl">
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                </div>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <motion.div
                    key={record._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg border-2 border-green-600 hover:border-green-400 transition-all bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            Location: {record.location.area},{" "}
                            {record.location.postOffice}
                          </span>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="col-span-2">
                            <span className="font-medium">Waste Types:</span>{" "}
                            {formatWasteTypes(record.typeOfWaste)}
                          </div>
                          <div>
                            <span className="font-medium">Total Size:</span>{" "}
                            {record.sizeOfWaste}
                          </div>
                          <div>
                            <span className="font-medium">Post Office ID:</span>{" "}
                            {record.postOfficeId}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Timestamp:</span>{" "}
                            {new Date(record.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Records Found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Start adding waste records to see them here"}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      </div>
    </div>
  );
};

export default BlockchainData;
