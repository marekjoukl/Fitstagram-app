import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import LogoutButton from "../ui/LogoutButton";
import LoginButton from "../ui/LoginButton";
import useSearchUsers from "../hooks/useSearchUsers";
import useSearchGroups from "../hooks/useSearchGroups";
import useGetPhotos from "../hooks/useGetPhotos";
import Popup from "../ui/Popup";
import { ArrowDown } from "../ui/ArrowDown";

type Photo = {
  id: number;
  name: string;
  description?: string;
  url: string;
  numOfLikes: number;
  numOfComments: number;
  date: string;
  tags: string[];
  uploader: {
    nickname: string;
    id: number;
  };
};

export default function Home() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [userQuery, setUserQuery] = useState("");
  const [groupQuery, setGroupQuery] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const {
    users,
    loading: loadingUsers,
    error: errorUsers,
  } = useSearchUsers(userQuery);
  const {
    groups,
    loading: loadingGroups,
    error: errorGroups,
  } = useSearchGroups(groupQuery);
  const {
    photos,
    loading: photosLoading,
    error: photosError,
    fetchPhotos,
  } = useGetPhotos(authUser?.id, authUser?.role);

  const handleGoToProfile = () => {
    if (authUser) {
      navigate(`/myProfile`);
    }
  };

  const handleUserSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserQuery(event.target.value);
  };

  const handleGroupSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGroupQuery(event.target.value);
  };

  const handleCreateGroup = () => {
    navigate(`/group/create`);
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closePopup = () => {
    setSelectedPhoto(null);
  };

  const handleCommentsUpdate = () => {
    fetchPhotos();
  };

  const handleGroupClick = (groupId: number) => {
    navigate(`/group/${groupId}`, { state: { from: "home" } });
  };

  const handleBrowseGroups = () => {
    navigate(`/groups`);
  };

  const handleManageTags = () => {
    navigate(`/tags`);
  };

  const handleUserClick = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-1/4 flex-col justify-between bg-white p-6 shadow-md">
        <div>
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                FITstagram
              </span>
            </h1>
          </div>

          {/* User Info */}
          {authUser ? (
            <div className="mb-10 text-center">
              <img
                src={authUser?.image}
                alt="User Avatar"
                className="mx-auto mb-4 h-24 w-24 rounded-full shadow-lg"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {authUser?.nickname}
              </h2>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  Posts:{" "}
                  <span className="font-medium text-gray-700">
                    {authUser?.photos?.length ?? 0}
                  </span>
                </p>
                <p>
                  Groups:{" "}
                  <span className="font-medium text-gray-700">
                    {authUser?.groups?.length ?? 0}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-10 text-center">
              <p className="text-center text-gray-500">
                You can browse public photos with limited functionality, for
                full access to FITstagram please login or register below.
              </p>
              <ArrowDown />
            </div>
          )}

          {/* Navigation Buttons */}
          {authUser && (
            <div className="flex flex-col space-y-4">
              <button
                className="w-full rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-600"
                onClick={handleGoToProfile}
              >
                Go to Profile
              </button>
              <button
                className="w-full rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                onClick={handleCreateGroup}
              >
                Create Group
              </button>
              <button
                className="w-full rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                onClick={handleBrowseGroups}
              >
                Browse Groups
              </button>
              {(authUser.role === "ADMIN" || authUser.role === "MODERATOR") && (
                <button
                  className="w-full rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                  onClick={handleManageTags}
                >
                  Manage Tags
                </button>
              )}
            </div>
          )}
        </div>

        {/* Logout/Login Button */}
        <div className="mt-4">
          {authUser ? (
            <LogoutButton onLogout={() => fetchPhotos()} />
          ) : (
            <LoginButton />
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between">
          {/* User Search Bar */}
          <div className="relative mr-4 w-1/2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M15.5 10a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={userQuery}
                onChange={handleUserSearchChange}
                className="block w-full rounded-full border border-gray-300 bg-white px-4 py-2 pl-10 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {userQuery && (
                <button
                  type="button"
                  onClick={() => setUserQuery("")}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {/* User Search Results */}
            {userQuery && (
              <div className="absolute z-[999] mt-2 w-full rounded-lg bg-white shadow-lg">
                {loadingUsers && <p className="p-4">Loading...</p>}
                {errorUsers && <p className="p-4 text-red-500">{errorUsers}</p>}
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex cursor-pointer items-center p-4 hover:bg-gray-100"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <img
                      src={user.image}
                      alt={user.username}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.nickname}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group Search Bar */}
          <div className="relative w-1/2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M15.5 10a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search groups..."
                value={groupQuery}
                onChange={handleGroupSearchChange}
                className="block w-full rounded-full border border-gray-300 bg-white px-4 py-2 pl-10 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {groupQuery && (
                <button
                  type="button"
                  onClick={() => setGroupQuery("")}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {/* Group Search Results */}
            {groupQuery && (
              <div className="absolute z-[999] mt-2 w-full rounded-lg bg-white shadow-lg">
                {loadingGroups && <p className="p-4">Loading...</p>}
                {errorGroups && (
                  <p className="p-4 text-red-500">{errorGroups}</p>
                )}
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex cursor-pointer items-center p-4 hover:bg-gray-100"
                    onClick={() => handleGroupClick(group.id)}
                  >
                    <div className="ml-4">
                      <p className="text-sm font-semibold">{group.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {photosLoading ? (
          <p>Loading posts...</p>
        ) : photosError ? (
          <p className="text-red-500">{photosError}</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {photos.map((photo: Photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square cursor-pointer rounded-lg bg-white shadow-md"
                onClick={() => handlePhotoClick(photo)}
              >
                {/* Image */}
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="h-full w-full rounded-lg object-cover group-hover:opacity-75"
                />
                {/* Overlay with Info */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-lg font-semibold text-white">
                    {photo.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">
                    By {photo.uploader.nickname}
                  </p>
                  <div className="mt-4 flex space-x-4 text-white">
                    <p>❤️ {photo.numOfLikes}</p>
                    <p>💬 {photo.numOfComments}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popup */}
        {selectedPhoto && (
          <Popup
            isOpen={selectedPhoto !== null}
            onClose={closePopup}
            photo={selectedPhoto}
            onUpdateComments={handleCommentsUpdate}
            onDeletePhoto={fetchPhotos}
          />
        )}
      </main>
    </div>
  );
}
