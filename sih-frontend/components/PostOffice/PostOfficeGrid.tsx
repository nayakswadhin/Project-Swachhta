"use client";

import React, { useState } from "react";
import { PostOffice } from "@/types/postOffice";
import { PostOfficeCard } from "./PostOfficeCard";
import App from "../ErrorReportCheck";

interface PostOfficeGridProps {
  postOffices: PostOffice[];
}

export function PostOfficeGrid({ postOffices }: PostOfficeGridProps) {
  const [openError, setOpenError] = useState(false);
  const [postOffice, setPostOffice] = useState(null);

  if (!postOffices || postOffices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">No post offices found.</p>
      </div>
    );
  }

  return openError ? (
    <App
      postOffice={postOffice}
      setOpenError={setOpenError}
      openError={openError}
    />
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 max-w-[2000px] mx-auto">
      {postOffices.map((postOffice) => {
        // Check if the postOffice data is in the expected format (inside data property)
        const postOfficeData = postOffice.data || postOffice;
        return (
          <PostOfficeCard
            key={postOfficeData._id}
            postOffice={postOfficeData}
            openError={openError}
            setOpenError={setOpenError}
            setPostOffice={setPostOffice}
          />
        );
      })}
    </div>
  );
}
