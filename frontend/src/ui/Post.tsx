import React from "react";

type PostProps = {
  photo: {
    id: number;
    name: string;
    description?: string;
    url: string;
    numOfLikes: number;
    numOfComments: number;
    date: string;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const Post: React.FC<PostProps> = ({ photo, onEdit, onDelete }) => {
  const formattedDate = new Date(photo.date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
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
          <span className="font-medium text-gray-800">"TODO"</span>
          <span className="ml-2">•</span>
          <span className="ml-2">{formattedDate}</span>
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {photo.description}
        </p>

        {/* Buttons */}
        <div className="mt-4 flex items-center justify-between">
          {/* Comments Button */}
          <button
            className="flex items-center space-x-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            onClick={() => alert("View comments")}
          >
            <span>💬</span>
            <span>{photo.numOfComments} Comments</span>
          </button>

          {/* Likes Button */}
          <button
            className="flex items-center space-x-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            onClick={() => alert("Like photo")}
          >
            <span>❤️</span>
            <span>{photo.numOfLikes} Likes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
