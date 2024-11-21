import React, { useState } from "react";
import Popup from "./Popup";

type PostProps = {
  photo: {
    id: number;
    name: string;
    description?: string;
    url: string;
    numOfLikes: number;
    numOfComments: number;
    date: string;
    uploader: {
      nickname: string;
    };
    uploaderId: number;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const Post: React.FC<PostProps> = ({ photo, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formattedDate = new Date(photo.date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <>
      <div className="relative rounded-lg bg-white shadow-md">
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
          <img
            src={photo.url}
            alt={photo.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <button
              className="mr-2 rounded-lg bg-blue-500 px-3 py-1 text-sm text-white shadow-md hover:bg-blue-600"
              onClick={() => onEdit(photo.id)}
            >
              Edit
            </button>
            <button
              className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white shadow-md hover:bg-red-600"
              onClick={() => onDelete(photo.id)}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Post Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800">{photo.name}</h3>

          {/* Uploader and Time */}
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="font-medium text-gray-800">
              {photo.uploader.nickname || "Loading..."}
            </span>
            <span className="ml-2">•</span>
            <span className="ml-2">{formattedDate}</span>
          </div>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {photo.description}
          </p>

          {/* View Details Button */}
          <button
            className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            onClick={toggleDetails}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Popup Integration */}
      <Popup isOpen={showDetails} onClose={toggleDetails} photo={photo} />
    </>
  );
};

export default Post;
