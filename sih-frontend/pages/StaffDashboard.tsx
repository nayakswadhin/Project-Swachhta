"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AlertTriangle,
  Leaf,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  ThermometerSun,
  Users,
  Trash2,
  MessageCircle,
  Bell,
  Droplets,
  Wind,
  Sun,
  Recycle,
  TreePine,
  Battery,
  Send,
  Inbox,
  BarChart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ImageIcon,
  Trophy,
  Star,
  TrendingUp,
  Upload,
  Download,
  FileText,
  Settings,
  HelpCircle,
  X,
  User,
  Video,
  Wallet,
  Shield,
  CurrencyIcon,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";
import { WasteNotification } from "../components/WasteNotification";
import { io } from "socket.io-client";
import { useEthereum } from "@/hooks/useEthereum";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import Link from "next/link";
import { useLifeNotifications } from "@/hooks/useLifeNotifications";
import { LifeNotification } from "@/components/LifeNotification";
import ErrorReportForm from "@/components/ErrorReportForm";

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

// Helper function to get color based on green score
const getGreenScoreColor = (score) => {
  switch (score.toLowerCase()) {
    case "excellent":
      return "text-emerald-600 font-bold";
    case "good":
      return "text-green-600 font-bold";
    case "average":
      return "text-amber-600 font-bold";
    case "poor":
      return "text-red-600 font-bold";
    default:
      return "text-gray-600 font-bold";
  }
};

interface SpitDetectionResponse {
  predictions?: Array<{
    class: string;
    confidence: number;
  }>;
  image?: {
    width: number;
    height: number;
  };
}

interface WasteNotificationData {
  type: "waste_detection";
  severity: "low" | "medium" | "high";
  message: string;
  details: {
    postOfficeId: string;
    score: number;
    totalWaste: number;
    percentageOrganicWaste: number;
    timestamp: string;
  };
}

const StaffDashboard = () => {
  const { account, contract, connectWallet } = useEthereum();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [selectedTab, setSelectedTab] = useState("announcements");
  const [postOfficeId, setPostOfficeId] = useState<string>("");
  const [postOfficeData, setPostOfficeData] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const { notifications, markAsRead, markAllAsRead } =
    useNotifications(postOfficeId);
  const [selectedArea, setSelectedArea] = useState("Lawns");
  const [notification, setNotification] =
    useState<WasteNotificationData | null>(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [greenScore, setGreenScore] = useState("average");
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] =
    useState<VideoUploadStatus | null>(null);
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [selectedRoomSize, setSelectedRoomSize] = useState("small");
  const [energyScore, setEnergyScore] = useState(0);
  const [wasteManagementScore, setWasteManagementScore] = useState(0);
  const [lifeScore, setLifeScore] = useState(0);
  const [cleanlinessScore, setCleanlinessScore] = useState(0);
  const [greenCredit, setGreenCredit] = useState(0);
  const [postOfficeLocation, setPostOfficeLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [userLocation, setUserLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [dump, setDump] = useState(0);

  const [lifeNotifications, setLifeNotifications] = useState<
    FormattedLifeAlert[]
  >([]);
  const [wasteNotifications, setWasteNotifications] = useState([]);

  const [currentLifeNotification, setCurrentLifeNotification] =
    useState<LifeNotification | null>(null);

  const { lifenotifications } = useLifeNotifications(postOfficeId);

  const [isErrorFormOpen, setIsErrorFormOpen] = useState(false);

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowDetailsModal(true);
  };

  const areaOptions = [
    { value: "Lawns", label: "Lawns" },
    { value: "Reception", label: "Reception Hall" },
    { value: "ClerkRoom", label: "Clerk Room" },
    { value: "FrontGate", label: "Front Gate" },
    { value: "ParkingArea", label: "Parking Area" },
    { value: "MainHall", label: "Main Hall" },
    { value: "BackOffice", label: "Back Office" },
    { value: "Others", label: "Others" },
  ];

  const [userPostOfficeId, setUserPostOfficeId] = useState<string>("");
  const [rankings, setRankings] = useState({
    cleanlinessRank: 0,
    lifeScoreRank: 0,
    greenScoreRank: 0,
    energyScoreRank: 0,
    wasteManagementRank: 0,
    totalPostOffices: 0,
  });

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        if (!postOfficeId) return;

        axios
          .post("http://localhost:3000/post-office/rankings", {
            postOfficeId: postOfficeId,
          })
          .then((res) => {
            console.log(res.data);
            setRankings(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };

    fetchRankings();
  }, [postOfficeId]);

  // Modify the performanceMetrics array to include real rankings
  const performanceMetrics = [
    {
      title: "Cleanliness Score",
      value: cleanlinessScore,
      target: 95,
      icon: <Trash2 className="h-5 w-5 text-emerald-600" />,
      trend: "up",
      rank: rankings.cleanlinessRank,
      totalOffices: rankings.totalPostOffices,
    },
    {
      title: "LiFE Score",
      value: lifeScore,
      target: 90,
      icon: <Leaf className="h-5 w-5 text-emerald-600" />,
      trend: "up",
      rank: rankings.lifeScoreRank,
      totalOffices: rankings.lifeScoreRank,
      description: "Lifestyle for Environment",
    },
    {
      title: "Green Score",
      value: greenScore,
      target: 88,
      icon: <TreePine className="h-5 w-5 text-emerald-600" />,
      trend: "up",
      rank: rankings.greenScoreRank,
      totalOffices: rankings.greenScoreRank,
      description: "Environmental Impact",
    },
  ];

  // Modify the sustainabilityMetrics array to include real rankings
  const sustainabilityMetrics = [
    {
      title: "Energy Efficiency",
      value: energyScore,
      target: 90,
      icon: <Battery className="h-5 w-5 text-emerald-600" />,
      trend: "up",
      rank: rankings.energyScoreRank,
      totalOffices: rankings.energyScoreRank,
    },
    {
      title: "Waste Management",
      value: wasteManagementScore,
      target: 85,
      icon: <Recycle className="h-5 w-5 text-emerald-600" />,
      trend: "down",
      rank: rankings.wasteManagementRank,
      totalOffices: rankings.wasteManagementRank,
    },
  ];

  useEffect(() => {
    const fetchPostOfficeData = async () => {
      try {
        // Get user data from localStorage
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          throw new Error("User data not found");
        }

        const userData = JSON.parse(userDataString);
        const postOfficeName = userData.user.postOffice;

        // Handle user location with proper type conversion
        const userCoords = {
          longitude: parseFloat(userData.user.longitude) || 0,
          latitude: parseFloat(userData.user.latitude) || 0,
        };
        setUserLocation(userCoords);

        // Fetch all post offices with error handling
        const response = await fetch("http://localhost:3000/post-office");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch post offices: ${response.statusText}`
          );
        }

        const postOffices = await response.json();
        if (!postOffices.data || !Array.isArray(postOffices.data)) {
          throw new Error("Invalid post office data received");
        }

        // Find matching post office with proper type checking
        const matchingPostOffice = postOffices.data.find(
          (po: {
            name: string;
            _id: string;
            lifeScore: number;
            cleanlinessScore: number;
            energyScore: number;
            wasteManagementScore: number;
            greenScore: number;
            greenCredits: number;
            longitude: string | number;
            latitude: string | number;
          }) => po.name.toLowerCase() === postOfficeName.toLowerCase()
        );

        if (!matchingPostOffice) {
          throw new Error(`Post office "${postOfficeName}" not found`);
        }

        // Set all scores in a more organized way
        setLifeScore(matchingPostOffice.lifeScore);
        setCleanlinessScore(matchingPostOffice.cleanlinessScore);
        setPostOfficeId(matchingPostOffice._id);
        setUserPostOfficeId(matchingPostOffice._id);
        setEnergyScore(matchingPostOffice.energyScore);
        setWasteManagementScore(matchingPostOffice.wasteManagementScore);
        setGreenScore(matchingPostOffice.greenScore);
        setGreenCredit(matchingPostOffice.greenCredits);

        // Handle post office location with proper type conversion
        const postOfficeCoords = {
          longitude: parseFloat(matchingPostOffice.longitude as string) || 0,
          latitude: parseFloat(matchingPostOffice.latitude as string) || 0,
        };
        setPostOfficeLocation(postOfficeCoords);

        // Fetch detailed post office information
        const detailsResponse = await fetch(
          `http://localhost:3000/post-office/${matchingPostOffice._id}`
        );
        if (!detailsResponse.ok) {
          throw new Error(
            `Failed to fetch post office details: ${detailsResponse.statusText}`
          );
        }

        const detailsData = await detailsResponse.json();
        if (!detailsData.data) {
          throw new Error("Invalid post office details received");
        }

        setPostOfficeData(detailsData.data);
        setUploadStatus({
          success: true,
          message: "Data fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching post office data:", error);
        setUploadStatus({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch post office data",
        });
      }
    };

    fetchPostOfficeData();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("lifeNotification", (data: LifeNotification) => {
      if (data.postOfficeId === userPostOfficeId) {
        const formattedNotification = {
          id: `${data.postOfficeId}-${data.parameters.timestamp}`,
          title: `Life Score Alert - ${data.lifeScore.toFixed(2)}%`,
          message: data.message,
          severity:
            data.lifeScore < 70
              ? "high"
              : data.lifeScore < 85
              ? "medium"
              : "low",
          time: data.parameters.timestamp,
          location: data.parameters.area,
          type: "life",
          lifeScore: data.lifeScore,
          plasticAmount: data.parameters.plasticAmount,
          recyclableWaste: data.parameters.recyclableWaste,
          messiness: data.parameters.messiness,
          binCount: data.parameters.binCount,
          overflowStatus: data.parameters.overflowStatus,
        };

        setLifeNotifications((prev) => [formattedNotification, ...prev]);
        setCurrentLifeNotification(data);

        // Auto-hide notification after 8 seconds
        setTimeout(() => {
          setCurrentLifeNotification(null);
        }, 8000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userPostOfficeId]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("wasteNotification", (data: WasteNotificationData) => {
      // Only show notification if it matches the user's post office ID
      if (data.details.postOfficeId === userPostOfficeId) {
        setNotification(data);

        // Auto-hide notification after 8 seconds
        setTimeout(() => {
          setNotification(null);
        }, 8000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userPostOfficeId]);

  // Add notification clear handlers
  const handleClearLifeNotification = () => {
    setCurrentLifeNotification(null);
  };

  const handleTrainingClick = () => {
    window.location.href = "/training-portal";
  };

  const formatTime = (time: Date) => {
    return formatDistanceToNow(new Date(time), { addSuffix: true });
  };

  const alerts = [
    ...notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      severity: notification.severity,
      isRead: notification.isRead,
      time: notification.time,
      postOffice: notification.postOffice,
      location: notification.location,
      type: `waste`,
      size: notification.size,
      photoLink: notification.photoLink,
      quantity: notification.quantity,
      score: notification.score,
      spit: notification.spit,
      dump: notification.dump || 0, // Add dump with default value
    })),
    ...lifenotifications.map((notification) => ({
      id: notification.id,
      title: `LiFE Score Alert`,
      message: ``,
      severity:
        notification.lifeScore < 70
          ? "high"
          : notification.lifeScore < 85
          ? "medium"
          : "low",
      isRead: false,
      time: notification.time,
      location: notification.location,
      type: "life",
      lifeScore: notification.lifeScore,
      plasticAmount: notification.plasticAmount,
      recyclableWaste: notification.recyclableWaste,
      messiness: notification.messiness.toFixed(2),
      binCount: notification.binCount,
      overflowStatus: notification.overflowStatus,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const tasks = [
    {
      title: "Complete Morning Inspection",
      status: "completed",
      priority: "high",
      time: "09:00 AM",
      assignee: "John Doe",
    },
    {
      title: "Update Sustainability Report",
      status: "in-progress",
      priority: "medium",
      time: "11:30 AM",
      assignee: "Sarah Smith",
    },
    {
      title: "Review Energy Consumption Data",
      status: "pending",
      priority: "high",
      time: "02:00 PM",
      assignee: "Mike Johnson",
    },
  ];

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const [blockchainData, setBlockchainData] = useState({
    location: "",
    typeOfWaste: "",
    sizeOfWaste: "",
    photolink: "",
  });

  interface BinDetectionResponse {
    predictions: Array<{
      type: string;
      confidence: number;
      location: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (!account) {
      setUploadStatus({
        success: false,
        message: "Please connect your wallet first",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Compress the image for spit detection
      const compressedImage = await compressImage(files[0]);

      const greenResponse = await fetch("http://localhost:3000/green/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: compressedImage }),
      });

      if (!greenResponse.ok) {
        throw new Error("Failed to detect greenery");
      }

      const dumpResponse = await fetch(
        "http://localhost:3000/dump-detection/detect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: compressedImage }),
        }
      );

      if (!dumpResponse.ok) {
        throw new Error("Failed to detect dump");
      }

      const dumpData = await dumpResponse.json();
      console.log("dumpData", dumpData);

      const dump = dumpData.predictions;
      console.log("dump", dump);

      const dumpLength = dump.length;

      setDump(dumpLength);

      // First, perform spit detection
      const spitResponse = await fetch(
        "http://localhost:3000/spit-detection/detect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: compressedImage }),
        }
      );

      const binResponse = await fetch(
        "http://localhost:3000/bin-detection/detect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: compressedImage }),
        }
      );

      const greenData = await greenResponse.json();
      console.log("green", greenData);
      // Map the green score to one of the expected values
      const greenScoreMap = {
        0: "poor",
        1: "average",
        2: "good",
        3: "excellent",
      };

      const mappedGreenScore =
        greenScoreMap[greenData.predicted_classes[0]] || "average";

      try {
        const greenScoreResponse = await fetch(
          "http://localhost:3000/greenScore/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postOfficeId: postOfficeId,
              score: mappedGreenScore, // Using mapped value that matches expected enum
            }),
          }
        );

        if (!greenScoreResponse.ok) {
          throw new Error("Failed to record green score");
        }

        const greenScoreData = await greenScoreResponse.json();
        console.log("Green score recorded:", greenScoreData);
      } catch (error) {
        console.error("Error recording green score:", error);
      }

      const overflowResponse = await fetch(
        "http://localhost:3000/overflow-detection/detect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: compressedImage }),
        }
      );

      if (!overflowResponse.ok) {
        const errorData = await overflowResponse.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${overflowResponse.status}`
        );
      }

      const overflowData = await overflowResponse.json();
      console.log("overflowData", overflowData);

      const overflowPredictions = overflowData.data.predictions;
      const isOverflowing = overflowData.data.top;
      const overflow = isOverflowing === "negative" ? 1 : 0;

      const binData: BinDetectionResponse = await binResponse.json();

      console.log("Raw binData:", binData);

      const hasBins =
        binData?.data?.predictions && binData.data.predictions.length > 0;
      const binDetails = hasBins
        ? binData.data.predictions.map((bin) => ({
            type: bin.type,
            confidence: (bin.confidence * 100).toFixed(2),
            location: {
              x: bin.location.x.toFixed(2),
              y: bin.location.y.toFixed(2),
              width: bin.location.width.toFixed(2),
              height: bin.location.height.toFixed(2),
            },
          }))
        : [];

      console.log("Processed binDetails:", binDetails);

      const spitData: SpitDetectionResponse = await spitResponse.json();
      let spit = 1;
      if (spitData.predictions.length === 0) spit = 0;

      const fd = new FormData();
      fd.append("file", files[0]);

      const carbonEmision = await axios.post(
        "http://localhost:8000/carbon",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const wasteResponse = await axios.post(
        "http://localhost:8000/detect",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const messyResponse = await axios.post(
        "http://localhost:8000/messy_predict",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const messy = (Math.ceil(messyResponse.data.result * 100) / 100).toFixed(
        2
      );

      // try {
      //   const tx = await contract.addRecord(
      //     blockchainData.location,
      //     blockchainData.typeOfWaste,
      //     blockchainData.sizeOfWaste,
      //     blockchainData.photolink
      //   );
      //   toast.loading("Adding waste record...");
      //   await tx.wait();
      //   toast.success("Waste record added successfully to blockchain!");
      //   setBlockchainData({
      //     location: "",
      //     typeOfWaste: "",
      //     sizeOfWaste: "",
      //     photolink: "",
      //   });
      // } catch (error) {
      //   toast.success("Waste record added successfully!");
      //   // toast.error("Failed to add waste record");
      //   console.error(error);
      // }

      const counts = wasteResponse.data.counts || {};

      const wasteData = {
        postOfficeId: postOfficeId,
        biodegradable: counts.BIODEGRADABLE || 0,
        plastic: counts.PLASTIC || 0,
        metal: counts.METAL || 0,
        paper: counts.PAPER || 0,
        cardboard: counts.CARDBOARD || 0,
        glass: counts.GLASS || 0,
        imageUrl: `http://localhost:8000${wasteResponse.data.annotated_image_url}`,
        spit,
        selectedArea,
        messy,
        bins: binDetails,
        overflow,
        numberOfCars: carbonEmision.data.object_counts.car,
        numberOfMotorCycle: carbonEmision.data.object_counts.motorcycle,
        dump: dump,
      };

      await axios.post("http://localhost:3000/waste/store", wasteData);

      const imageFormData = new FormData();
      imageFormData.append("image", files[0]);
      imageFormData.append("postOfficeId", postOfficeId);
      imageFormData.append("Area", selectedArea);

      const storageResponse = await fetch(
        "http://localhost:3000/images/upload",
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const storageData = await storageResponse.json();

      if (storageResponse.ok) {
        setUploadStatus({
          success: true,
          message: "Image processed and uploaded successfully!",
        });
        // Close the modal after successful upload
        setIsModalOpen(false);
        // Auto-hide the success toast after 3 seconds
        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
      } else {
        throw new Error(storageData.error || "Failed to upload image");
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to upload image",
      });
      // Auto-hide the error toast after 3 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
    } finally {
      setIsUploading(false);
      // Reset the file input
      const fileInput = document.getElementById(
        "manual-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  interface VideoProcessingResponse {
    room_id: string;
    room_type: string;
    room_occupancy: string;
    total_duration_seconds: number;
    total_energy_kWh: number;
    threshold_kWh: number;
    efficiency_status: string;
  }

  interface VideoUploadStatus {
    success: boolean;
    message: string;
    data?: VideoProcessingResponse;
  }

  interface EnergyData {
    roomId: string;
    roomType: string;
    duration: number;
    energyKWh: number;
    efficiency: string;
  }

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsVideoUploading(true);
    setVideoUploadStatus(null);

    try {
      // Process video
      const processFormData = new FormData();
      processFormData.append("file", files[0]);

      const processingResponse = await fetch(
        `http://localhost:8000/process_video?room_id=${selectedRoomSize}`,
        {
          method: "POST",
          body: processFormData,
        }
      );

      if (!processingResponse.ok) {
        const errorData = await processingResponse.json();
        throw new Error(errorData.detail || "Failed to process video");
      }

      const processingData = await processingResponse.json();

      // Validate efficiency status
      const efficiencyMap: {
        [key: string]: "efficient" | "moderate" | "inefficient";
      } = {
        high: "efficient",
        medium: "moderate",
        low: "inefficient",
      };

      // Validate required data
      if (
        !processingData.total_duration_seconds ||
        !processingData.total_energy_kWh
      ) {
        throw new Error(
          "Invalid video processing data: missing duration or energy consumption"
        );
      }

      if (!postOfficeId) {
        throw new Error("Post office ID is required");
      }

      if (!selectedRoomSize) {
        throw new Error("Room size selection is required");
      }

      // Create energy data object with validated data
      const energyDataPayload = {
        postOfficeId: postOfficeId,
        roomType: selectedRoomSize.toLowerCase(),
        duration: Number(processingData.total_duration_seconds),
        energyKWh: Number(processingData.total_energy_kWh),
        efficiency:
          efficiencyMap[processingData.efficiency_status] || "moderate",
      };

      // Validate numbers before sending
      if (
        isNaN(energyDataPayload.duration) ||
        energyDataPayload.duration <= 0
      ) {
        throw new Error("Invalid duration value");
      }

      if (
        isNaN(energyDataPayload.energyKWh) ||
        energyDataPayload.energyKWh <= 0
      ) {
        throw new Error("Invalid energy consumption value");
      }

      try {
        if (!contract) {
          throw new Error("Smart contract not initialized");
        }

        // Show loading toast before transaction
        const loadingToast = toast.loading("Adding waste record...");

        // Validate blockchain data
        if (
          !blockchainData.location ||
          !blockchainData.typeOfWaste ||
          !blockchainData.sizeOfWaste ||
          !blockchainData.photolink
        ) {
          toast.dismiss(loadingToast);
          throw new Error("All waste record fields are required");
        }

        const tx = await contract.addRecord(
          blockchainData.location,
          blockchainData.typeOfWaste,
          blockchainData.sizeOfWaste,
          blockchainData.photolink
        );

        // Wait for transaction confirmation
        await tx.wait();

        // Dismiss loading and show success
        toast.dismiss(loadingToast);
        toast.success("Waste record added successfully to blockchain!");

        // Reset form data
        setBlockchainData({
          location: "",
          typeOfWaste: "",
          sizeOfWaste: "",
          photolink: "",
        });
      } catch (error) {
        // Handle specific error types
        if (error instanceof Error) {
          toast.error(`Failed to add waste record: ${error.message}`);
        } else {
          toast.error("Failed to add waste record: Unknown error occurred");
        }
        console.error("Blockchain error:", error);
      }

      // Save energy data to backend
      const energyResponse = await fetch("http://localhost:3000/energy-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(energyDataPayload),
      });

      if (!energyResponse.ok) {
        const errorData = await energyResponse.json();
        throw new Error(errorData.message || "Failed to save energy data");
      }

      const savedEnergyData = await energyResponse.json();

      if (!savedEnergyData.success) {
        throw new Error(
          savedEnergyData.message || "Failed to save energy data"
        );
      }

      // Update local state with the validated data
      setEnergyData({
        roomType: savedEnergyData.data.roomType,
        duration: savedEnergyData.data.duration,
        energyKWh: savedEnergyData.data.energyKWh,
        efficiency: savedEnergyData.data.efficiency,
      });

      setVideoUploadStatus({
        success: true,
        message: `Video processed and data saved! Energy consumption: ${savedEnergyData.data.energyKWh.toFixed(
          6
        )} kWh (${savedEnergyData.data.efficiency})`,
        data: processingData,
      });

      setIsModalOpen(false);

      // Auto-hide success message
      setTimeout(() => {
        setVideoUploadStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Error details:", error);
      setVideoUploadStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to process video",
      });

      setTimeout(() => {
        setVideoUploadStatus(null);
      }, 5000);
    } finally {
      setIsVideoUploading(false);
      const fileInput = document.getElementById(
        "video-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const fetchMessages = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) throw new Error("User data not found");

      const userData = JSON.parse(userDataString);
      const userId = userData.user.userId;

      const response = await fetch(
        `http://localhost:3000/messages?userId=${userId}&userRole=USER`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const announcements = messages.map((msg) => {
    const importanceMap = {
      CRITICAL: {
        title: "Critical Update",
        type: "CRITICAL",
        badge: "bg-purple-100 text-purple-800",
        container: "border-purple-200",
      },
      URGENT: {
        title: "Urgent Notice",
        type: "URGENT",
        badge: "bg-red-100 text-red-800",
        container: "border-red-200",
      },
      WARNING: {
        title: "Warning Notice",
        type: "WARNING",
        badge: "bg-amber-100 text-amber-800",
        container: "border-amber-200",
      },
      SUCCESS: {
        title: "Success Update",
        type: "SUCCESS",
        badge: "bg-emerald-100 text-emerald-800",
        container: "border-emerald-200",
      },
      INFO: {
        title: "Information",
        type: "INFO",
        badge: "bg-blue-100 text-blue-800",
        container: "border-blue-200",
      },
    };

    const announcementType =
      importanceMap[msg.importance] || importanceMap["INFO"];

    return {
      title: announcementType.title,
      type: announcementType.type,
      time: formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true }),
      description: msg.content,
      from:
        msg.sender.role === "DIVISIONAL_OFFICE"
          ? "Divisional Office"
          : msg.sender.name || "System",
      badge: announcementType.badge,
      container: announcementType.container,
    };
  });

  const [alertFilter, setAlertFilter] = useState("all"); // "all", "life", "waste"

  // Filter alerts based on selected type
  const filteredAlerts = alerts.filter((alert) => {
    if (alertFilter === "all") return true;
    if (alertFilter === "life") return alert.type === "life";
    if (alertFilter === "waste") return alert.type === "waste";
    return true;
  });

  const [selectedAlertImage, setSelectedAlertImage] = useState<string | null>(
    null
  );

  // Modify the handleNotificationClick function to include image URL
  const handleNotificationClick = async (alertId: string, alert: any) => {
    // Store the image URL from the alert
    if (alert.photoLink) {
      setSelectedAlertImage(alert.photoLink);
    }
    setSelectedAlert(alert); // Store the selected alert data
    setIsErrorFormOpen(true); // Open the error report form
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const [isWithinRange, setIsWithinRange] = useState<boolean>(false);

  useEffect(() => {
    const distance = calculateDistance(
      userLocation.longitude,
      userLocation.latitude,
      postOfficeLocation.longitude,
      postOfficeLocation.latitude
    );

    if (distance <= 2.6) {
      setIsWithinRange(true);
    } else {
      setIsWithinRange(false);
    }
  }, [userLocation, postOfficeLocation]);

  return (
    <div className="min-h-screen bg-green-100">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 border-2 border-slate-500"
        >
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <Avatar className="h-16 w-16 ring-4 ring-emerald-300">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>PO</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
                Post Office Dashboard
              </h1>
              <div className="flex items-center gap-2 text-emerald-800 mt-1">
                <MapPin className="h-5 w-5" />
                <p className="font-semibold text-lg">
                  {postOfficeData ? (
                    <>
                      {postOfficeData.name}
                      {postOfficeData.areaId &&
                        `, ${postOfficeData.areaId.name}`}
                    </>
                  ) : (
                    "Loading..."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-4">
            <TooltipProvider>
              {/* Training Module Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button
                      variant="default"
                      className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-2.5 shadow-lg"
                      onClick={handleTrainingClick}
                    >
                      <GraduationCap className="h-5 w-5" />
                      <span className="hidden sm:inline">Training Portal</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Access training materials</TooltipContent>
              </Tooltip>
              {account ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Wallet className="text-green-500" size={20} />
                    <span className="text-sm text-gray-600">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                  </div>

                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    {isWithinRange ? (
                      <>
                        <DialogTrigger asChild>
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Button
                              variant="outline"
                              className={cn(
                                "gap-2 border-2 border-emerald-600 hover:bg-emerald-50 font-semibold",
                                isUploading
                                  ? "text-amber-600"
                                  : uploadStatus?.success
                                  ? "text-emerald-600"
                                  : "text-emerald-800"
                              )}
                              onClick={() => setIsModalOpen(true)}
                            >
                              <Upload className="h-5 w-5" />
                              <span className="hidden sm:inline">
                                Upload Media
                              </span>
                            </Button>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Upload Post Office Media</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="area"
                                className="text-sm font-medium text-gray-700"
                              >
                                Select Area
                              </label>
                              <Select
                                value={selectedArea}
                                onValueChange={setSelectedArea}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select area" />
                                </SelectTrigger>
                                <SelectContent>
                                  {areaOptions.map((area) => (
                                    <SelectItem
                                      key={area.value}
                                      value={area.value}
                                    >
                                      {area.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-2">
                              <label
                                htmlFor="manual-upload"
                                className="text-sm font-medium text-gray-700"
                              >
                                Upload Image
                              </label>
                              <input
                                type="file"
                                id="manual-upload"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept="image/jpeg,image/png,image/jpg"
                              />
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                  document
                                    .getElementById("manual-upload")
                                    ?.click()
                                }
                                disabled={isUploading}
                              >
                                {isUploading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 mr-2" />
                                    Uploading Image...
                                  </>
                                ) : (
                                  <>
                                    <ImageIcon className="h-5 w-5 mr-2" />
                                    Select Image
                                  </>
                                )}
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor="room-size"
                                className="text-sm font-medium text-gray-700"
                              >
                                Select Room Size
                              </label>
                              <Select
                                value={selectedRoomSize}
                                onValueChange={setSelectedRoomSize}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select room size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="small">
                                    Small Room
                                  </SelectItem>
                                  <SelectItem value="medium">
                                    Medium Room
                                  </SelectItem>
                                  <SelectItem value="large">
                                    Large Room
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Video Upload Section */}
                            <div className="space-y-2">
                              <label
                                htmlFor="video-upload"
                                className="text-sm font-medium text-gray-700"
                              >
                                Upload Video for Energy Analysis
                              </label>
                              <input
                                type="file"
                                id="video-upload"
                                className="hidden"
                                onChange={handleVideoUpload}
                                accept="video/mp4,video/quicktime"
                              />
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                  document
                                    .getElementById("video-upload")
                                    ?.click()
                                }
                                disabled={isVideoUploading}
                              >
                                {isVideoUploading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 mr-2" />
                                    Processing Video...
                                  </>
                                ) : (
                                  <>
                                    <Video className="h-5 w-5 mr-2" />
                                    Select Video for Energy Analysis
                                  </>
                                )}
                              </Button>
                              {videoUploadStatus && (
                                <div
                                  className={cn(
                                    "mt-2 p-3 rounded-md",
                                    videoUploadStatus.success
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-red-50 text-red-700"
                                  )}
                                >
                                  <p className="text-sm font-medium">
                                    {videoUploadStatus.message}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </>
                    ) : (
                      <div className="text-red-600 font-medium px-4 py-2 bg-red-50 rounded-md">
                        You must be within range of the post office to upload
                        media
                      </div>
                    )}
                    <AnimatePresence>
                      {videoUploadStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={cn(
                            "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50",
                            videoUploadStatus.success
                              ? "bg-emerald-100 border-2 border-emerald-500"
                              : "bg-red-100 border-2 border-red-500"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {videoUploadStatus.success ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <p
                              className={cn(
                                "font-medium",
                                videoUploadStatus.success
                                  ? "text-emerald-800"
                                  : "text-red-800"
                              )}
                            >
                              {videoUploadStatus.message}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2"
                              onClick={() => setVideoUploadStatus(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Dialog>
                </>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
              <AnimatePresence>
                {uploadStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50",
                      uploadStatus.success
                        ? "bg-emerald-100 border-2 border-emerald-500"
                        : "bg-red-100 border-2 border-red-500"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {uploadStatus.success ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <p
                        className={cn(
                          "font-medium",
                          uploadStatus.success
                            ? "text-emerald-800"
                            : "text-red-800"
                        )}
                      >
                        {uploadStatus.message}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => setUploadStatus(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Settings Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button
                      variant="outline"
                      className="gap-2 border-2 border-emerald-600 hover:bg-emerald-50 font-semibold text-emerald-800"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="hidden sm:inline">Settings</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Dashboard settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Upload Status Toast */}
          <AnimatePresence>
            {uploadStatus && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50",
                  uploadStatus.success
                    ? "bg-emerald-100 border-2 border-emerald-500"
                    : "bg-red-100 border-2 border-red-500"
                )}
              >
                <div className="flex items-center gap-2">
                  {uploadStatus.success ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <p
                    className={cn(
                      "font-medium",
                      uploadStatus.success ? "text-emerald-800" : "text-red-800"
                    )}
                  >
                    {uploadStatus.message}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => setUploadStatus(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              key={index}
            >
              <Card className="p-6 border-2 border-slate-500 bg-white backdrop-blur-sm hover:bg-blue-50 transition-all shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      {React.cloneElement(metric.icon, {
                        className: "h-6 w-6 text-emerald-700",
                      })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-950">
                        {metric.title}
                      </h3>
                      {metric.description && (
                        <p className="text-sm font-medium text-emerald-700">
                          {metric.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {metric.rank && (
                    <div className="flex items-center gap-2 bg-amber-100 px-3 py-1.5 rounded-full">
                      <Trophy className="h-5 w-5 text-amber-600" />
                      <span className="font-bold text-amber-700">
                        Rank {metric.rank}/{metric.totalOffices}
                      </span>
                    </div>
                  )}
                </div>
                <Progress
                  value={metric.value}
                  className="h-3 mb-3 bg-slate-100"
                />
                <div className="flex items-center justify-between text-sm">
                  <p
                    className={cn(
                      "font-bold text-lg",
                      metric.title === "Green Score"
                        ? getGreenScoreColor(greenScore)
                        : "text-emerald-800"
                    )}
                  >
                    Current:{" "}
                    {metric.title === "LiFE Score"
                      ? lifeScore + `%`
                      : metric.title === "Green Score"
                      ? greenScore.toUpperCase()
                      : cleanlinessScore + `%`}
                  </p>
                  <Badge
                    variant="outline"
                    className="border-2 border-green-700 font-semibold px-3 py-1"
                  >
                    Target: {metric.target}%
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Sustainability Metrics */}
            <div className="grid grid-cols-1 gap-4">
              {sustainabilityMetrics.map((metric, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  key={index}
                >
                  <Card className="p-6 border-2 border-slate-500 bg-white backdrop-blur-sm hover:bg-blue-50 transition-all shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          {React.cloneElement(metric.icon, {
                            className: "h-6 w-6 text-emerald-700",
                          })}
                        </div>
                        <h3 className="text-lg font-bold text-emerald-950">
                          {metric.title}
                        </h3>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-2 border-green-700 font-semibold px-3 py-1"
                      >
                        Target: {metric.target}%
                      </Badge>
                    </div>
                    <Progress
                      value={metric.value}
                      className="h-3 mb-3 bg-slate-100"
                    />
                    <p className="text-emerald-800 font-bold text-lg">
                      Current: {metric.value}%
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 border-2 border-slate-500 bg-white backdrop-blur-sm shadow-lg">
                <h3 className="text-xl font-bold text-emerald-950 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Link href="/blockchain">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 border-2 border-green-700 hover:bg-blue-50 text-emerald-800 font-semibold"
                      >
                        <Shield className="h-5 w-5" />
                        View Blockchain Data
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 border-2 border-green-700 hover:bg-blue-50 text-emerald-800 font-semibold"
                    >
                      <Coins className="h-5 w-5" />
                      Green Credits : {greenCredit}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 border-2 border-green-700 hover:bg-blue-50 text-emerald-800 font-semibold"
                    >
                      <Star className="h-5 w-5" />
                      View Rankings
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 border-2 border-green-700 hover:bg-blue-50 text-emerald-800 font-semibold"
                    >
                      <TrendingUp className="h-5 w-5" />
                      Performance Stats
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Middle Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Announcements & Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 border-2 border-green-700 bg-white backdrop-blur-sm shadow-lg">
                <Tabs
                  defaultValue="announcements"
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                >
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="border-2 border-green-600 bg-white p-2">
                      <TabsTrigger
                        value="announcements"
                        className="data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:font-bold gap-2 px-4 py-2"
                      >
                        <Inbox className="h-5 w-5" />
                        Announcements
                      </TabsTrigger>
                      <TabsTrigger
                        value="alerts"
                        className="data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:font-bold gap-2 px-4 py-2"
                      >
                        <AlertCircle className="h-5 w-5" />
                        Alerts
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="announcements">
                    <ScrollArea className="h-[400px] pr-4">
                      <AnimatePresence>
                        <div className="space-y-4">
                          {announcements.map((announcement, index) => {
                            // Default style in case type doesn't match
                            const defaultStyle = {
                              badge: "bg-gray-100 text-gray-800",
                              container: "border-gray-300",
                              title: "text-gray-900",
                              description: "text-gray-700",
                              meta: "text-gray-600",
                            };

                            const typeStyles = {
                              INFO: {
                                badge: "bg-blue-100 text-blue-800",
                                container: "border-blue-400 border-2",
                                title: "text-blue-900",
                                description: "text-blue-700",
                                meta: "text-blue-600",
                              },
                              SUCCESS: {
                                badge: "bg-emerald-100 text-emerald-800 ",
                                container: "border-emerald-400 border-2",
                                title: "text-emerald-900",
                                description: "text-emerald-700",
                                meta: "text-emerald-600",
                              },
                              WARNING: {
                                badge: "bg-amber-100 text-amber-800",
                                container: "border-amber-400 border-2",
                                title: "text-amber-900",
                                description: "text-amber-700",
                                meta: "text-amber-600",
                              },
                              URGENT: {
                                badge: "bg-red-100 text-red-800",
                                container: "border-red-400 border-2",
                                title: "text-red-900",
                                description: "text-red-700",
                                meta: "text-red-600",
                              },
                              CRITICAL: {
                                badge: "bg-purple-100 text-purple-800",
                                container: "border-purple-400 border-2",
                                title: "text-purple-900",
                                description: "text-purple-700",
                                meta: "text-purple-600",
                              },
                            };

                            const style =
                              announcement.type && typeStyles[announcement.type]
                                ? typeStyles[announcement.type]
                                : defaultStyle;

                            return (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className={`p-4 rounded-lg border bg-white hover:bg-opacity-95 transition-all ${style.container}`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <h4
                                        className={`text-lg font-bold ${style.title}`}
                                      >
                                        {announcement.title}
                                      </h4>
                                      <Badge
                                        className={`font-semibold px-3 py-1 ${style.badge}`}
                                      >
                                        {announcement.type}
                                      </Badge>
                                    </div>
                                    <p
                                      className={`text-base font-medium ${style.description}`}
                                    >
                                      {announcement.description}
                                    </p>
                                    <div
                                      className={`flex items-center gap-2 text-sm font-semibold ${style.meta}`}
                                    >
                                      <span>{announcement.from}</span>
                                      <span>•</span>
                                      <span>{announcement.time}</span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`hover:bg-white/80 ${style.meta}`}
                                  >
                                    <ChevronRight className="h-5 w-5" />
                                  </Button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </AnimatePresence>
                    </ScrollArea>
                  </TabsContent>

                  {/* Previous imports remain the same */}

                  <TabsContent value="alerts">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-emerald-900">
                          System Notifications
                        </h3>
                        <div className="flex items-center gap-4">
                          <Select
                            value={alertFilter}
                            onValueChange={setAlertFilter}
                          >
                            <SelectTrigger className="w-[180px] border-2 border-emerald-600">
                              <SelectValue placeholder="Filter alerts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Alerts</SelectItem>
                              <SelectItem value="life">
                                LiFE Score Alerts
                              </SelectItem>
                              <SelectItem value="waste">
                                Waste Alerts
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <AnimatePresence>
                        <div className="space-y-4">
                          {filteredAlerts.map((alert) => (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={alert.id}
                              className={cn(
                                "p-6 rounded-lg border-2 transition-all hover:shadow-lg",
                                alert.severity === "high"
                                  ? "border-red-400 hover:border-red-500 bg-red-50/80"
                                  : alert.severity === "medium"
                                  ? "border-amber-400 hover:border-amber-500 bg-amber-50/80"
                                  : "border-emerald-400 hover:border-emerald-500 bg-emerald-50/80"
                              )}
                            >
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={cn(
                                        "p-3 rounded-lg",
                                        alert.severity === "high"
                                          ? "bg-red-100"
                                          : alert.severity === "medium"
                                          ? "bg-amber-100"
                                          : "bg-emerald-100"
                                      )}
                                    >
                                      {alert.type === "life" ? (
                                        <Leaf
                                          className={cn(
                                            "h-6 w-6",
                                            alert.severity === "high"
                                              ? "text-red-600"
                                              : alert.severity === "medium"
                                              ? "text-amber-600"
                                              : "text-emerald-600"
                                          )}
                                        />
                                      ) : (
                                        <AlertTriangle
                                          className={cn(
                                            "h-6 w-6",
                                            alert.severity === "high"
                                              ? "text-red-600"
                                              : alert.severity === "medium"
                                              ? "text-amber-600"
                                              : "text-emerald-600"
                                          )}
                                        />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4
                                          className={cn(
                                            "text-lg font-bold",
                                            alert.severity === "high"
                                              ? "text-red-950"
                                              : alert.severity === "medium"
                                              ? "text-amber-950"
                                              : "text-emerald-950"
                                          )}
                                        >
                                          {alert.title}
                                        </h4>
                                        {!alert.isRead && (
                                          <Badge
                                            className={cn(
                                              "px-2",
                                              alert.severity === "high"
                                                ? "bg-red-100 text-red-800"
                                                : alert.severity === "medium"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-emerald-100 text-emerald-800"
                                            )}
                                          >
                                            New
                                          </Badge>
                                        )}
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "ml-2 capitalize",
                                            alert.type === "life"
                                              ? "border-emerald-500 text-emerald-700"
                                              : "border-purple-500 text-purple-700"
                                          )}
                                        >
                                          {alert.type}
                                        </Badge>
                                      </div>
                                      <p
                                        className={cn(
                                          "text-base mt-1",
                                          alert.severity === "high"
                                            ? "text-red-800"
                                            : alert.severity === "medium"
                                            ? "text-amber-800"
                                            : "text-emerald-800"
                                        )}
                                      >
                                        {alert.message}
                                      </p>
                                    </div>
                                  </div>
                                  {alert.photoLink && (
                                    <img
                                      src={alert.photoLink}
                                      alt="Alert"
                                      className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200 shadow-md"
                                    />
                                  )}
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {alert.type === "life" ? (
                                    <>
                                      <div className="space-y-1">
                                        <p className="text-sm text-emerald-600 font-medium">
                                          Life Score
                                        </p>
                                        <div className="text-xl font-bold text-emerald-900">
                                          {alert.lifeScore.toFixed(2)}%
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm text-emerald-600 font-medium">
                                          Messiness
                                        </p>
                                        <div className="text-xl font-bold text-emerald-900">
                                          {alert.messiness}%
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="space-y-1">
                                        <p className="text-sm text-emerald-600 font-medium">
                                          Score
                                        </p>
                                        <div className="text-xl font-bold text-emerald-900">
                                          {alert.score}
                                        </div>
                                      </div>
                                      {alert.quantity && (
                                        <div className="space-y-1">
                                          <p className="text-sm text-emerald-600 font-medium">
                                            Items
                                          </p>
                                          <div className="text-xl font-bold text-emerald-900">
                                            {alert.quantity.totalCount}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  <div className="space-y-1">
                                    <p className="text-sm text-emerald-600 font-medium">
                                      Location
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-emerald-700" />
                                      <span className="text-emerald-900 font-semibold">
                                        {alert.location}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-emerald-600 font-medium">
                                      Time
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-emerald-700" />
                                      <span className="text-emerald-900 font-semibold">
                                        {formatTime(alert.time)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                      "border-emerald-300 hover:bg-emerald-50",
                                      alert.severity === "high"
                                        ? "text-red-700"
                                        : alert.severity === "medium"
                                        ? "text-amber-700"
                                        : "text-emerald-700"
                                    )}
                                    onClick={() =>
                                      handleNotificationClick(alert.id, alert)
                                    }
                                  >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    <span>Respond</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                      "border-emerald-300 hover:bg-emerald-50",
                                      alert.severity === "high"
                                        ? "text-red-700"
                                        : alert.severity === "medium"
                                        ? "text-amber-700"
                                        : "text-emerald-700"
                                    )}
                                    onClick={() => handleViewDetails(alert)}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {filteredAlerts.length === 0 && (
                            <div className="text-center py-12">
                              <Bell className="h-12 w-12 mx-auto mb-4 text-emerald-300" />
                              <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                                No{" "}
                                {alertFilter !== "all" ? `${alertFilter} ` : ""}
                                Notifications
                              </h3>
                              <p className="text-emerald-600">
                                You&apos;re all caught up! New alerts will
                                appear here.
                              </p>
                            </div>
                          )}
                        </div>
                      </AnimatePresence>
                    </ScrollArea>
                  </TabsContent>

                  {/* Details Modal */}
                  <Dialog
                    open={showDetailsModal}
                    onOpenChange={setShowDetailsModal}
                  >
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-2xl font-extrabold text-emerald-950 tracking-tight">
                          Alert Details
                        </DialogTitle>
                      </DialogHeader>

                      {selectedAlert && (
                        <div className="space-y-6 py-4">
                          {/* Alert Overview */}
                          <div className="flex items-start gap-6">
                            {selectedAlert.photoLink && (
                              <div className="flex-shrink-0">
                                <img
                                  src={selectedAlert.photoLink}
                                  alt="Alert"
                                  className="w-32 h-32 rounded-lg object-cover border-2 border-emerald-100 shadow-md"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xl font-bold text-emerald-950 mb-2 tracking-tight">
                                {selectedAlert.title}
                              </h4>
                              <p className="text-emerald-700 leading-relaxed">
                                {selectedAlert.message}
                              </p>
                            </div>
                          </div>

                          {/* Key Metrics */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Life Score */}
                            {selectedAlert.type === "life" && (
                              <Card className="p-4 border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-200">
                                <h5 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                  Life Score
                                </h5>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-emerald-900">
                                    {selectedAlert.lifeScore.toFixed(2)}
                                  </span>
                                  <span className="text-sm font-medium text-emerald-600">
                                    / 100
                                  </span>
                                </div>
                              </Card>
                            )}

                            {/* Cleanliness Score */}
                            {selectedAlert.score && (
                              <Card className="p-4 border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-200">
                                <h5 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                  Cleanliness Score
                                </h5>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-emerald-900">
                                    {selectedAlert.score}
                                  </span>
                                  <span className="text-sm font-medium text-emerald-600">
                                    / 100
                                  </span>
                                </div>
                              </Card>
                            )}

                            {/* Size */}
                            {selectedAlert.size && (
                              <Card className="p-4 border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-200">
                                <h5 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                  Area Size
                                </h5>
                                <div className="text-2xl font-bold text-emerald-900">
                                  {selectedAlert.size} m²
                                </div>
                              </Card>
                            )}

                            {selectedAlert.type === "waste" &&
                              selectedAlert.dump !== undefined && (
                                <Card className="p-4 border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-200">
                                  <h5 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                    Dump Detection Status
                                  </h5>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-emerald-900">
                                      {selectedAlert.dump}
                                    </span>
                                    <span className="text-sm font-medium text-emerald-600">
                                      {selectedAlert.dump === 1
                                        ? "dump"
                                        : "dumps"}{" "}
                                      detected
                                    </span>
                                  </div>
                                </Card>
                              )}
                          </div>

                          {/* Life Score Details */}
                          {selectedAlert.type === "life" && (
                            <div className="space-y-4">
                              <h5 className="text-lg font-bold text-emerald-900 tracking-tight">
                                Environmental Metrics
                              </h5>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Card className="p-4 border-2 border-emerald-100">
                                  <h6 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                    Plastic Amount
                                  </h6>
                                  <div className="text-2xl font-bold text-emerald-900">
                                    {selectedAlert.plasticAmount}
                                  </div>
                                </Card>
                                <Card className="p-4 border-2 border-emerald-100">
                                  <h6 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                    Recyclable Waste
                                  </h6>
                                  <div className="text-2xl font-bold text-emerald-900">
                                    {selectedAlert.recyclableWaste}
                                  </div>
                                </Card>
                                <Card className="p-4 border-2 border-emerald-100">
                                  <h6 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                    Messiness Level
                                  </h6>
                                  <div className="text-2xl font-bold text-emerald-900">
                                    {selectedAlert.messiness}%
                                  </div>
                                </Card>
                                <Card className="p-4 border-2 border-emerald-100">
                                  <h6 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                    Bin Count
                                  </h6>
                                  <div className="text-2xl font-bold text-emerald-900">
                                    {selectedAlert.binCount}
                                  </div>
                                </Card>
                                <Card className="p-4 border-2 border-emerald-100">
                                  <h6 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                    Overflow Status
                                  </h6>
                                  <div className="text-2xl font-bold text-emerald-900">
                                    {selectedAlert.overflowStatus
                                      ? "Yes"
                                      : "No"}
                                  </div>
                                </Card>
                              </div>
                            </div>
                          )}

                          {/* Waste Quantity Breakdown */}
                          {selectedAlert.quantity && (
                            <div className="space-y-4">
                              <h5 className="text-lg font-bold text-emerald-900 tracking-tight">
                                Waste Breakdown
                              </h5>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {Object.entries(
                                  selectedAlert.quantity.frequency
                                ).map(([type, count]) => (
                                  <Card
                                    key={type}
                                    className="p-4 border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-200"
                                  >
                                    <h6 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                                      {type}
                                    </h6>
                                    <div className="text-2xl font-bold text-emerald-900">
                                      {count}
                                    </div>
                                  </Card>
                                ))}
                              </div>

                              {/* Total Count */}
                              <Card className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-emerald-800">
                                    Total Items
                                  </span>
                                  <span className="text-2xl font-bold text-emerald-900">
                                    {selectedAlert.quantity.totalCount}
                                  </span>
                                </div>
                              </Card>
                            </div>
                          )}
                        </div>
                      )}

                      <DialogFooter className="border-t pt-4 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setShowDetailsModal(false)}
                          className="min-w-[100px] border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold"
                        >
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Tabs>
              </Card>
            </motion.div>

            {/* Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 border-2 border-slate-500 bg-white backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-emerald-950">
                    Today's Tasks
                  </h3>
                  <Button
                    variant="outline"
                    className="gap-2 border-2 border-green-700 hover:bg-emerald-50 font-semibold text-emerald-800"
                  >
                    <Calendar className="h-5 w-5" />
                    View Calendar
                  </Button>
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {tasks.map((task, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border-2 border-slate-500 bg-white hover:bg-blue-50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              task.status === "completed"
                                ? "bg-emerald-600"
                                : task.status === "in-progress"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          />
                          <div>
                            <h4 className="text-lg font-bold text-emerald-950">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 text-base font-medium text-emerald-700">
                              <Clock className="h-4 w-4" />
                              {task.time}
                              <span>•</span>
                              <Users className="h-4 w-4" />
                              {task.assignee}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                ? "secondary"
                                : "outline"
                            }
                            className={`font-semibold px-3 py-1 ${
                              task.priority === "medium"
                                ? "bg-white text-emerald-800 hover:bg-white/80 border-2 border-green-700"
                                : ""
                            }`}
                          >
                            {task.priority}
                          </Badge>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : task.status === "in-progress"
                                ? "secondary"
                                : "outline"
                            }
                            className={`font-semibold px-3 py-1 border-2 ${
                              task.status === "completed"
                                ? "bg-emerald-600 border-emerald-700"
                                : task.status === "in-progress"
                                ? "bg-white text-emerald-800 hover:bg-white/80 border-green-700"
                                : "border-green-700"
                            }`}
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <div
        className="fixed right-4 space-y-4"
        style={{ top: "1rem", maxWidth: "32rem", width: "100%" }}
      >
        <AnimatePresence>
          {currentLifeNotification && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="relative"
            >
              <div className="bg-white/95 backdrop-blur-sm border-2 border-emerald-500 rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-emerald-100">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-emerald-900">
                        LiFE Score Update
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearLifeNotification}
                        className="text-emerald-700 hover:bg-emerald-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-emerald-100 rounded-full">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${currentLifeNotification.lifeScore}%`,
                            }}
                          />
                        </div>
                        <span className="text-lg font-bold text-emerald-700">
                          {currentLifeNotification.lifeScore.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-emerald-600">
                          Location
                        </p>
                        <p className="text-base font-semibold text-emerald-800">
                          {currentLifeNotification.parameters.area}
                        </p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-emerald-600">
                          Recyclable Waste
                        </p>
                        <p className="text-base font-semibold text-emerald-800">
                          {currentLifeNotification.parameters.recyclableWaste}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(
                          new Date(
                            currentLifeNotification.parameters.timestamp
                          ),
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {notification && (
          <WasteNotification
            postOfficeId={notification.details.postOfficeId}
            score={notification.details.score}
            quantity={{ totalCount: notification.details.totalWaste }}
            percentageOrganicWaste={notification.details.percentageOrganicWaste}
            timestamp={notification.details.timestamp}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
      <ErrorReportForm
        open={isErrorFormOpen}
        onClose={() => {
          setIsErrorFormOpen(false);
          setSelectedAlert(null);
          setSelectedAlertImage(null); // Clear the selected image when closing
        }}
        onSubmit={() => {
          setIsErrorFormOpen(false);
          setSelectedAlert(null);
          setSelectedAlertImage(null); // Clear the selected image when submitting
        }}
        postOfficeId={postOfficeId}
        alertImage={selectedAlertImage} // Pass the selected image URL
      />
    </div>
  );
};

export default StaffDashboard;
