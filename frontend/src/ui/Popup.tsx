import React, { useEffect, useState } from "react";
import useGetComments from "../hooks/useGetComments";
import useAddComment from "../hooks/useAddComment";
import useDeleteComment from "../hooks/useDeleteComment";
import useLikePhoto from "../hooks/useLikePhoto";
import useUnlikePhoto from "../hooks/useUnlikePhoto";
import useAddPhotoToGroup from "../hooks/useAddPhotoToGroup";
import useRemovePhotoFromGroup from "../hooks/useRemovePhotoFromGroup"; // Import the new hook
import { useAuthContext } from "../contexts/AuthContext";
import Comment from "./Comment";
import { Role } from "@prisma/client";
import { useNavigate } from "react-router-dom";

type Photo = {
  id: number;
  name: string;
  description?: string;
  url: string;
  numOfLikes: number;
  date: string;
  uploader: {
    nickname: string;
    id: number;
  };
  tags: string[]; 
};

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
  onUpdateComments?: () => void;
  groupId?: number; // Add groupId prop
  onRemoveFromGroup?: () => void; // Add onRemoveFromGroup prop
};

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  photo,
  onUpdateComments = () => {},
  groupId, // Add groupId prop
  onRemoveFromGroup, // Add onRemoveFromGroup prop
}) => {
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const { authUser } = useAuthContext();
  const [isMemberOfGroup, setIsMemberOfGroup] = useState(false);
  type Group = {
    id: number;
    name: string;
  };
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [showGroups, setShowGroups] = useState(false);
  const { addComment, loading: addingComment } = useAddComment();
  const { likePhoto, loading: liking } = useLikePhoto();
  const { unlikePhoto, loading: unliking } = useUnlikePhoto();
  const { addPhotoToGroup, loading: addingPhotoToGroup } = useAddPhotoToGroup();
  const { removePhotoFromGroup, loading: removingPhotoFromGroup } = useRemovePhotoFromGroup(); // Use the new hook
  const {
    comments,
    loading: loadingComments,
    setComments,
  } = useGetComments(photo?.id || 0);
  const { deleteComment, loading: deletingComment } = useDeleteComment();
  const navigate = useNavigate();
  useEffect(() => {
    if (!photo || !authUser) return;

    const fetchLikedState = async () => {
      try {
        const res = await fetch(`/api/photos/${photo.id}/like`);
        if (!res.ok) throw new Error("Failed to fetch liked state");
        const data = await res.json();
        setLiked(data.liked);
      } catch (error) {
        console.error("Error fetching liked state:", error);
      }
    };

    fetchLikedState();
  }, [photo, authUser]);

  useEffect(() => {
    const checkGroupMembership = async () => {
      if (!authUser) return;
      try {
        const res = await fetch(`/api/users/${authUser.id}/groups`);
        if (!res.ok) throw new Error("Failed to fetch group membership");
        const data = await res.json();
        setGroups(data);
        setIsMemberOfGroup(data.length > 0);
      } catch (error) {
        console.error("Error fetching group membership:", error);
      }
    };

    checkGroupMembership();
  }, [authUser]);

  const handleNavigate = () => {
    authUser?.id === photo?.uploader.id
      ? navigate("/myProfile")
      : navigate(`/profile/${photo?.uploader.id}`);
  };

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

  const handleLike = async () => {
    const success = liked
      ? await unlikePhoto(photo.id)
      : await likePhoto(photo.id);
    if (success) {
      setLiked(!liked);
      photo.numOfLikes += liked ? -1 : 1; // Update like count
    }
  };

  const handleAddToGroupClick = () => {
    setShowGroups(!showGroups);
  };

  const handleAddToGroup = async (groupId: number) => {
    if (!photo) return;
    const data = await addPhotoToGroup(groupId, photo.id);
    if (data) {
      console.log('Photo added to group:', data);
    }
    setShowGroups(!showGroups);
  };

  const handleRemoveFromGroup = async () => {
    if (!photo || !groupId) return;
    const data = await removePhotoFromGroup(groupId, photo.id);
    if (!data) {
      console.log('Photo removed from group:', data);
      onClose(); // Close the popup after removal
      if (onRemoveFromGroup) onRemoveFromGroup(); // Call the callback function
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
                <span
                  className="cursor-pointer underline"
                  onClick={handleNavigate}
                >
                  {photo.uploader.nickname}
                </span>
              </p>
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Uploaded on:</span>{" "}
                {formattedDate}
              </p>
              <p className="mb-4 text-sm text-gray-600">{photo.description}</p>
              <div className="mb-4 flex items-center">
                {authUser && (
                  <button
                    onClick={handleLike}
                    className={`mr-2 h-8 w-8 rounded-full ${
                      liked ? "bg-red-500" : "bg-gray-300"
                    } flex items-center justify-center transition-transform duration-300 hover:scale-110`}
                    disabled={liking || unliking}
                  >
                    {liked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-white"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-5 w-5 text-gray-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        />
                      </svg>
                    )}
                  </button>
                )}
                <p className="text-sm font-semibold text-gray-800">
                  ❤️ {photo.numOfLikes} Likes
                </p>
              </div>
              <div className="mb-4 flex flex-wrap">
                {photo.tags && photo.tags.map((tag) => (
                  <div
                    key={tag}
                    className="m-1 p-2 rounded-lg bg-gray-200 text-black"
                  >
                    {tag}
                  </div>
                ))}
              </div>
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
                      canDelete={
                        authUser?.id === comment.author.id ||
                        authUser?.role === Role.ADMIN ||
                        authUser?.role === Role.MODERATOR
                      }
                      onDelete={handleDeleteComment}
                    />
                  ))}
                </div>
              )}
              {authUser && (
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
              )}
            </div>
          </div>
          <div className="flex flex-start">
            {authUser?.id === photo?.uploader.id && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {groupId && (
                  <button
                    onClick={handleRemoveFromGroup}
                    className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600"
                    disabled={removingPhotoFromGroup}
                  >
                    Remove from this group
                  </button>
                )}
                {isMemberOfGroup && (
                  <button
                    onClick={handleAddToGroupClick}
                    className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600"
                    disabled={addingPhotoToGroup}
                  >
                    Add to group
                  </button>
                )}
                {showGroups && (
                  <div className="absolute left-30 mt-2 w-48 rounded-lg bg-white p-4 shadow-lg">
                    <h4 className="mb-2 text-sm font-semibold text-gray-800">Your Groups</h4>
                    <ul className="space-y-2">
                      {groups.map((group) => (
                        <li
                          key={group.id}
                          className="cursor-pointer text-sm text-gray-700 hover:underline"
                          onClick={() => handleAddToGroup(group.id)}
                        >
                          {group.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
