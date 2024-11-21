import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import useUserPhotos from "../hooks/useUserPhotos";
import useDeletePhoto from "../hooks/useDeletePhoto";
import { useEffect, useState } from "react";

export default function Profile() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  const { photos: initialPhotos, loadingPhotos } = useUserPhotos(authUser?.id);
  const { deletePhoto, loadingDelete } = useDeletePhoto();

  const [photos, setPhotos] = useState(initialPhotos);

  useEffect(() => {
    if (!loadingPhotos) {
      setPhotos(initialPhotos);
    }
  }, [initialPhotos, loadingPhotos]);

  const handleDelete = async (photoId: number) => {
    const success = await deletePhoto(photoId);
    if (success) {
      setPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.id !== photoId),
      );
    }
  };

  if (loadingPhotos || loadingDelete) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* User Info */}
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <button
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-300"
            onClick={() => {
              navigate("/");
            }}
          >
            ← Back to Main Page
          </button>
        </div>

        <div className="mb-8 flex flex-col items-center bg-white p-6 shadow-md lg:flex-row lg:p-8">
          <img
            src={authUser?.image}
            alt="authUser Avatar"
            className="mb-4 h-36 w-36 rounded-full shadow-lg lg:mb-0"
          />
          <div className="lg:ml-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {authUser?.nickname}
            </h1>
            <p className="mt-2 text-gray-600">{authUser?.description}</p>
            <button
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
              onClick={() => navigate(`/profile/${authUser?.id}/edit`)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Photos Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Your Posts</h2>
            <button
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600"
              onClick={() => navigate(`/profile/${authUser?.id}/add-post`)}
            >
              Add New Post
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg bg-white shadow-md"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="h-full w-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition hover:opacity-100">
                  <button
                    className="mr-2 rounded-lg bg-blue-500 px-3 py-1 text-sm text-white shadow-md hover:bg-blue-600"
                    onClick={() =>
                      navigate(
                        `/profile/${authUser?.id}/edit-photo/${photo.id}`,
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="mr-2 rounded-lg bg-red-500 px-3 py-1 text-sm text-white shadow-md hover:bg-red-600"
                    onClick={() => handleDelete(photo.id)}
                    disabled={loadingDelete}
                  >
                    {loadingDelete ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
