import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Post from "../ui/Post";
import useGetUserById from "../hooks/useGetUserById";
import useDeleteUser from "../hooks/useDeleteUser";
import useBlockUser from "../hooks/useBlockUser";
import { useAuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, loading, error, refetch } = useGetUserById(Number(userId));

  const [photos, setPhotos] = useState(user?.photos || []);
  const { deleteUser, loadingDelete } = useDeleteUser();
  const { blockUser, loadingBlock } = useBlockUser();
  const { authUser } = useAuthContext();

  // Update photos when the user data is loaded
  useEffect(() => {
    if (user?.photos) {
      setPhotos(user.photos);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const handleBlockUser = async () => {
    const blocked = await blockUser(Number(userId));
    if (blocked) {
      refetch();
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user?.nickname}?`,
    );

    if (confirmDelete) {
      const deleted = await deleteUser(Number(userId));
      if (deleted) {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* User Info */}
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex justify-between">
          <button
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-300"
            onClick={() => {
              navigate("/");
            }}
          >
            ← Back to Main Page
          </button>
          <div>
            {(authUser?.role === "ADMIN" || authUser?.role === "MODERATOR") &&
              (loadingBlock ? (
                user?.role === "USER" ? (
                  "Unblocking user..."
                ) : (
                  "Blocking user..."
                )
              ) : (
                <button
                  className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-gray-600"
                  onClick={handleBlockUser}
                  disabled={loadingDelete || loadingBlock}
                >
                  {user?.role === "USER" ? "Unblock user" : "Block user"}
                </button>
              ))}
            {authUser?.role === "ADMIN" && (
              <div className="inline-block pl-4">
                {" "}
                {loadingDelete ? (
                  <p className="text-red-500">Deleting user...</p>
                ) : (
                  <button
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
                    onClick={handleDeleteUser}
                    disabled={loadingDelete || loadingBlock}
                  >
                    Delete user
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center bg-white p-6 shadow-md lg:flex-row lg:p-8">
          <img
            src={user?.image}
            alt={`${user?.nickname}'s Avatar`}
            className="mb-4 h-36 w-36 rounded-full shadow-lg lg:mb-0"
          />
          <div className="lg:ml-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.nickname}
            </h1>
            <p className="mt-2 text-gray-600">{user?.description}</p>
          </div>
        </div>

        {/* Photos Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{`${
              user?.nickname || "User"
            }'s Posts`}</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {photos.map((photo: any) => (
              <Post
                key={photo.id}
                photo={{
                  id: photo.id,
                  name: photo.name,
                  description: photo.description,
                  url: photo.url,
                  numOfLikes: photo.numOfLikes || 0,
                  numOfComments: photo.comments?.length || 0,
                  date: photo.date,
                  uploaderId: photo.uploaderId,
                  uploader: { nickname: user.nickname, id: user.id },
                  tags: photo.tags,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
