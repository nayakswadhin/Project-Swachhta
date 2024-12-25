import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Recycle,
  AlertTriangle,
  Factory,
  Leaf,
  Trash2,
  Car,
  Timer,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

interface ErrorReport {
  _id: string;
  detectionType: string;
  errorCategory: string;
  severity: string;
  additionalNotes: string;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
  cleanlinessScoreId?: string;
  alertImage?: string;
  __v?: number;
}

interface PostOffice {
  _id: string;
  cleanlinessScore: number;
  greenScore: 'poor' | 'good' | 'excellent' | 'average';
  greenCredits: number;
}

const ITEMS_PER_PAGE = 6;

const getDetectionIcon = (type: string) => {
  const icons = {
    recyclable: <Recycle className="h-5 w-5" />,
    messy: <AlertTriangle className="h-5 w-5" />,
    overflow: <Factory className="h-5 w-5" />,
    greenery: <Leaf className="h-5 w-5" />,
    bin: <Trash2 className="h-5 w-5" />,
    vehicle: <Car className="h-5 w-5" />,
    frequency: <Timer className="h-5 w-5" />,
    spit: <Scale className="h-5 w-5" />,
  };
  return icons[type as keyof typeof icons] || <AlertCircle className="h-5 w-5" />;
};

const getSeverityColor = (severity: string) => {
  const colors = {
    low: "bg-emerald-100 text-emerald-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };
  return colors[severity as keyof typeof colors] || "";
};

export default function App({ postOffice, setOpenError, openError }: { 
  postOffice: PostOffice;
  setOpenError: (open: boolean) => void;
  openError: boolean;
}) {
  const [errorReports, setErrorReports] = useState<ErrorReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchErrorReports();
  }, [postOffice._id]);

  const fetchErrorReports = async () => {
    try {
      const res = await axios.post("http://localhost:3000/errorpostOffice", {
        postOfficeId: postOffice._id,
      });
      setErrorReports(res.data.errorReports);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch error reports",
        variant: "destructive",
      });
    }
  };

  const updateGreenCredits = async (credits: number) => {
    try {
      await axios.post(`http://localhost:3000/post-office/${postOffice._id}/update-green-credits`);
      
    } catch (err) {
      console.error("Failed to update green credits", err);
      throw err;
    }
  };

  const handleStatusUpdate = async (reportId: string, newStatus: "approved" | "rejected") => {
    try {
   
      if (newStatus === "approved") {
        // Update green credits using the new endpoint
        const newGreenCredits = postOffice.greenCredits + 5;
        await updateGreenCredits(newGreenCredits);
      }

      // Remove the report from local state
      setErrorReports((prev) => prev.filter((report) => report._id !== reportId));

      toast({
        title: `Report ${newStatus}`,
        description: newStatus === "approved" 
          ? "Report approved and green credits added"
          : "Report rejected successfully",
        variant: newStatus === "approved" ? "default" : "destructive",
      });
    } catch (err) {
      console.error("Failed to update status", err);
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    }
  };

  const filteredReports = errorReports.filter((report) => {
    const matchesSearch =
      report.additionalNotes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.detectionType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      filterSeverity === "all" || report.severity === filterSeverity;
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-emerald-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">
              Error Report Dashboard
            </h1>
            <p className="text-emerald-700">
              Review and manage detection error reports
            </p>
          </div>
          <Button
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200 border-red-200 text-red-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            onClick={() => setOpenError(!openError)}
          >
            <X className="h-5 w-5 mr-2" />
            Close Dashboard
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {report.alertImage ? (
                    <img
                      src={report.alertImage}
                      alt="Alert"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getDetectionIcon(report.detectionType)}
                        <span className="font-semibold text-gray-800 capitalize">
                          {report.detectionType.replace("_", " ")}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                          report.severity
                        )}`}
                      >
                        {report.severity} Impact
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {report.additionalNotes}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>
                        {new Date(report.timestamp).toLocaleDateString()}
                      </span>
                      <span className="capitalize">
                        {report.errorCategory.replace("_", " ")}
                      </span>
                    </div>

                    {report.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStatusUpdate(report._id, "approved")}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(report._id, "rejected")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`text-center py-2 rounded-md ${
                          report.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {report.status === "approved" ? "Approved" : "Rejected"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)}{" "}
                of {filteredReports.length} reports
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}