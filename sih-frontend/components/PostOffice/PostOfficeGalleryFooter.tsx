import React from 'react';
import { Image as ImageIcon, MessageSquare } from 'lucide-react';
import { PostOfficeGallery } from '@/types/postOffice';

interface PostOfficeGalleryFooterProps {
  gallery: PostOfficeGallery[];
  onMessageClick: () => void;
}

export function PostOfficeGalleryFooter({ gallery, onMessageClick }: PostOfficeGalleryFooterProps) {
  return (
    <div className="border-t border-green-100 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-green-50">
              <ImageIcon className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-700">{gallery?.length ?? 0} Photos</span>
          </div>
          <button
            onClick={onMessageClick}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors duration-200"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Message</span>
          </button>
        </div>
        <button className="px-6 py-2.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md">
          View Gallery
        </button>
      </div>
    </div>
  );
}