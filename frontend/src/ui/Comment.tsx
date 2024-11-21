import React from "react";

type CommentProps = {
  id: number;
  content: string;
  author: {
    nickname: string;
    image: string;
    id: number;
  };
  canDelete: boolean;
  onDelete: (commentId: number) => void;
};

const Comment: React.FC<CommentProps> = ({
  id,
  content,
  author,
  canDelete,
  onDelete,
}) => {
  return (
    <div className="flex items-start">
      <img
        src={author.image || "https://via.placeholder.com/40"}
        alt={author.nickname}
        className="mr-3 h-10 w-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{author.nickname}</p>
        <p className="mt-1 text-sm text-gray-600">{content}</p>
      </div>
      {canDelete && (
        <button
          onClick={() => onDelete(id)}
          className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default Comment;
