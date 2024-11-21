import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import LogoutButton from "../ui/LogoutButton";
import useSearchUsers from "../hooks/useSearchUsers";
import useAllPhotos from "../hooks/useAllPhotos";
import Post from "../ui/Post";
import { Photo } from "../hooks/useUserPhotos";

export default function Home() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { users, loading, error } = useSearchUsers(query);
  
  const { photos, loadingPhotos } = useAllPhotos(authUser?.id);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleGoToProfile = () => {
    if (authUser) {
      navigate(`/profile/${authUser.id}`);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseOverlay = () => {
    setSelectedPhoto(null);
  };

  const handleOverlayClick = (event: { target: any; currentTarget: any; }) => {
    if (event.target === event.currentTarget) {
      handleCloseOverlay();
    }
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
          {/* Search Bar */}
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
              className="block w-full rounded-full border border-gray-300 bg-white px-4 py-2 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
            {/* Search Results */}
            {query && (
              <div className="absolute mt-2 w-full rounded-lg bg-white shadow-lg">
                {loading && <p className="p-4">Loading...</p>}
                {error && <p className="p-4 text-red-500">{error}</p>}
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

          {/* Add Photo Button */}
          <button className="ml-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600">
            Add Photo
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-6">
          {loadingPhotos ? (
            <p>Loading...</p>
          ) : (
            photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square w-full rounded-lg bg-white shadow-md cursor-pointer"
                  onClick={() => handlePhotoClick(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
            ))
          )}
        </div>
      </main>

      {/* Photo Overlay */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2 rounded-full bg-white hover:bg-gray-300"
              onClick={handleCloseOverlay}
            >
              &times;
            </button>
            <Post
              photo={{
                id: selectedPhoto.id,
                name: selectedPhoto.name,
                description: selectedPhoto.description ?? '',
                url: selectedPhoto.url,
                numOfLikes: selectedPhoto.numOfLikes || 0,
                numOfComments: selectedPhoto.comments?.length || 0,
                date: selectedPhoto.date,
              }}
              onEdit={(id) => 
                navigate(`/profile/${authUser?.id}/edit-photo/${id}`)
              }
              onDelete={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
