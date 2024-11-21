import React, { useState } from "react";
import useGetComments from "../hooks/useGetComments";
import useAddComment from "../hooks/useAddComment";
import useDeleteComment from "../hooks/useDeleteComment";
import { useAuthContext } from "../contexts/AuthContext";
import Comment from "./Comment";

type Photo = {
  id: number;
  name: string;
  description?: string;
  url: string;
  numOfLikes: number;
  date: string;
  uploader: {
    nickname: string;
  };
};

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
  onUpdateComments: () => void;
};

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  photo,
  onUpdateComments,
}) => {
  const [newComment, setNewComment] = useState("");
  const { authUser } = useAuthContext();
  const { addComment, loading: addingComment } = useAddComment();
  const {
    comments,
    loading: loadingComments,
    setComments,
  } = useGetComments(photo?.id || 0);
  const { deleteComment, loading: deletingComment } = useDeleteComment();

  if (!isOpen || !photo) return null;

  const formattedDate = new Date(photo.date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const addedComment = await addComment(photo.id, newComment);
    if (addedComment) {
      setComments((prev) => [...prev, addedComment]);
      setNewComment("");
      onUpdateComments();
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const isDeleted = await deleteComment(commentId);
    if (isDeleted) {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      onUpdateComments();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-lg">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-400"
          >
            Close
          </button>
          <div className="flex">
            {/* Left Section: Photo Details */}
            <div className="w-1/2 p-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                {photo.name}
              </h2>
              <img
                src={photo.url}
                alt={photo.name}
                className="mb-4 h-64 w-full rounded-lg object-cover"
              />
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Uploaded by:</span>{" "}
                {photo.uploader.nickname}
              </p>
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Uploaded on:</span>{" "}
                {formattedDate}
              </p>
              <p className="mb-4 text-sm text-gray-600">{photo.description}</p>
              <p className="mb-4 text-sm font-semibold text-gray-800">
                ❤️ {photo.numOfLikes} Likes
              </p>
            </div>

            {/* Right Section: Comments */}
            <div className="w-1/2 border-l p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-800">
                Comments ({comments.length})
              </h3>
              {loadingComments ? (
                <p>Loading comments...</p>
              ) : (
                <div className="max-h-64 space-y-4 overflow-y-auto">
                  {comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      id={comment.id}
                      content={comment.content}
                      author={comment.author}
                      canDelete={authUser?.id === comment.author.id}
                      onDelete={handleDeleteComment}
                    />
                  ))}
                </div>
              )}
              <div className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add a comment..."
                  rows={2}
                  disabled={addingComment || deletingComment}
                />
                <button
                  onClick={handleAddComment}
                  className="mt-2 w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 disabled:opacity-50"
                  disabled={addingComment || deletingComment}
                >
                  {addingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
