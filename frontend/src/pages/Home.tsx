import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import LogoutButton from "../ui/LogoutButton";
import useSearchUsers from "../hooks/useSearchUsers";
import useSearchGroups from "../hooks/useSearchGroups";
import useGetPhotos from "../hooks/useGetPhotos";
import Popup from "../ui/Popup";

type Photo = {
  id: number;
  name: string;
  description?: string; // Optional property
  url: string;
  numOfLikes: number;
  numOfComments: number;
  date: string;
  uploader: {
    nickname: string;
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
  const { photos, loading: photosLoading, error: photosError } = useGetPhotos();

  const handleGoToProfile = () => {
    if (authUser) {
      navigate(`/profile/${authUser.id}`);
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

  const formattedDate = selectedPhoto
    ? new Date(selectedPhoto.date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "Unknown Date";

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
                Posts: <span className="font-medium text-gray-700">42</span>
              </p>
              <p>
                Groups: <span className="font-medium text-gray-700">5</span>
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
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
            <button className="w-full rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
              Settings
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-4">
          <LogoutButton />
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
              <div className="absolute mt-2 w-full rounded-lg bg-white shadow-lg">
                {loadingUsers && <p className="p-4">Loading...</p>}
                {errorUsers && <p className="p-4 text-red-500">{errorUsers}</p>}
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-4 hover:bg-gray-100"
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
              <div className="absolute mt-2 w-full rounded-lg bg-white shadow-lg">
                {loadingGroups && <p className="p-4">Loading...</p>}
                {errorGroups && (
                  <p className="p-4 text-red-500">{errorGroups}</p>
                )}
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center p-4 hover:bg-gray-100"
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
          <Popup isOpen={selectedPhoto !== null} onClose={closePopup}>
            <div className="flex">
              {/* Left Section: Photo Details */}
              <div className="w-1/2 p-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  {selectedPhoto.name}
                </h2>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.name}
                  className="mb-4 h-64 w-full rounded-lg object-cover"
                />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">Uploaded by:</span>{" "}
                  {selectedPhoto.uploader.nickname}
                </p>
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">Uploaded on:</span>{" "}
                  {formattedDate}
                </p>
                <p className="mb-4 text-sm text-gray-600">
                  {selectedPhoto.description}
                </p>
                <p className="mb-4 text-sm font-semibold text-gray-800">
                  ❤️ {selectedPhoto.numOfLikes} Likes
                </p>
              </div>

              {/* Right Section: Comments */}
              <div className="w-1/2 border-l p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  Comments ({selectedPhoto.numOfComments})
                </h3>
                <div className="space-y-4 overflow-y-auto">
                  {/* Dummy Comments */}
                  <div className="flex items-start">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User Avatar"
                      className="mr-3 h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        John Doe
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Amazing photo! Love the composition.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User Avatar"
                      className="mr-3 h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Jane Smith
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        The colors are stunning!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User Avatar"
                      className="mr-3 h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Alice Brown
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Where was this taken? It's beautiful!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </main>
    </div>
  );
}
