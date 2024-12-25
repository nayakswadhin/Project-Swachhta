import React, { useState } from "react";
import {
  Building2,
  Sparkles,
  Image as ImageIcon,
  User,
  Mail,
  X,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageDialog } from "./MessageDialog";

export interface PostOffice {
  _id: string;
  areaId: {
    _id: string;
    name: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  name: string;
  cleanlinessScore: number;
  photoLinks: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PostOfficeCardProps {
  postOffice: PostOffice;
  openError: boolean;
  setOpenError: (value: boolean) => void;
  setPostOffice: (postOffice: PostOffice) => void;
}

export function PostOfficeCard({
  postOffice,
  openError,
  setOpenError,
  setPostOffice,
}: PostOfficeCardProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  if (!postOffice) {
    return null;
  }

  const handleErrorClick = () => {
    setPostOffice(postOffice);
    setOpenError(!openError);
  };

  return (
    <>
      <MessageDialog
        postOffice={postOffice}
        open={showMessage}
        onOpenChange={setShowMessage}
      />

      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                <span className="text-green-600">{postOffice.name}</span>
                <span className="text-gray-700"> - Photo Gallery</span>
              </span>
              <button
                onClick={() => setShowGallery(false)}
                className="p-2 hover:bg-green-50 rounded-full transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500 hover:text-green-600" />
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-auto mt-6 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postOffice.photoLinks?.map((photo, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={photo}
                    alt={`Post Office Photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a
                        href={photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg font-medium transform scale-95 group-hover:scale-100 transition-all duration-300 hover:bg-white"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="group relative bg-white/90 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-7 border border-green-100">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative space-y-6">
          {/* Post Office Name and Icon */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="p-3.5 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl shadow-sm">
                <Building2 className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {postOffice.name}
                </h3>
                <p className="text-sm font-medium text-green-600 mt-1.5">
                  Area: {postOffice.areaId?.name || "Unknown Area"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleErrorClick}
                className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                title="Report Error"
              >
                <AlertTriangle className="h-6 w-6 text-red-600 hover:text-red-700" />
              </button>
              <button
                onClick={() => setShowMessage(true)}
                className="p-2 hover:bg-green-50 rounded-full transition-colors duration-200"
                title="Send Message"
              >
                <MessageCircle className="h-6 w-6 text-green-600 hover:text-green-700" />
              </button>
            </div>
          </div>

          {/* User Information */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                In-charge: {postOffice.userId?.name || "Not Assigned"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Email: {postOffice.userId?.email || "Not Available"}
              </span>
            </div>
          </div>

          {/* Cleanliness Score */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:transform hover:scale-[1.02]">
            <div
              className={cn(
                "p-3 rounded-xl shadow-sm",
                "bg-gradient-to-br from-amber-100 to-amber-50"
              )}
            >
              <Sparkles className={cn("h-5 w-5", "text-amber-600")} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Cleanliness Score
              </p>
              <p className="text-lg font-bold text-gray-900">
                {postOffice.cleanlinessScore}%
              </p>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="border-t border-green-100 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-green-50">
                  <ImageIcon className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-700">
                  {postOffice.photoLinks?.length || 0} Photos
                </span>
              </div>
              <button
                onClick={() => setShowGallery(true)}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
