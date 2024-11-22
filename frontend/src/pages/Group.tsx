import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import useGetGroupById from "../hooks/useGetGroupById";
import useDeletePhoto from "../hooks/useDeletePhoto";
import { useEffect, useState } from "react";
import Post from "../ui/Post";
import ManageMembersPopup from "../ui/ManageMembersPopup"; // Import the new component

export default function Group() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const { groupId } = useParams();

  const { group, photos: initialPhotos, loading, error } = useGetGroupById(Number(groupId));
  const { deletePhoto, loadingDelete } = useDeletePhoto();

  const [photos, setPhotos] = useState(initialPhotos);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  useEffect(() => {
    if (!loading) {
      setPhotos(initialPhotos);
    }
  }, [initialPhotos, loading]);

  const handleDelete = async (photoId: number) => {
    const success = await deletePhoto(photoId);
    if (success) {
      setPhotos((prevPhotos: typeof initialPhotos) =>
        prevPhotos.filter((photo: typeof initialPhotos[0]) => photo.id !== photoId),
      );
    }
  };

  const handleManageMembersClick = () => {
    setSelectedGroup(group);
    setShowManageMembers(true);
  };

  const closeManageMembersPopup = () => {
    setShowManageMembers(false);
    setSelectedGroup(null);
  };

  if (loading || loadingDelete) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
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
          <div className="text-center text-red-500">
            <p>Error loading group data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Group Info */}
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
            src={group?.image}
            alt="Group Avatar"
            className="mb-4 h-36 w-36 rounded-full shadow-lg lg:mb-0"
          />
          <div className="lg:ml-6">
            <h1 className="text-3xl font-bold text-black-800">
              {group?.name}
            </h1>
            <p className="mt-2 text-gray-600">{group?.description}</p>
            {authUser?.id === group?.managerId && (
              <button
                className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
                onClick={handleManageMembersClick}
              >
                Manage Members
              </button>
            )}
          </div>
        </div>

        {/* Photos Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Group Posts</h2>
            {authUser?.id === group?.managerId && (
              <button
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600"
                onClick={() => navigate(`/group/${groupId}/add-post`)}
              >
                Add New Post
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-6">
            {photos.map((photo: typeof initialPhotos[0]) => (
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
                  uploader: { nickname: photo.uploader.nickname, id: photo.uploader.id },
                }}
                onEdit={(id) =>
                  navigate(`/group/${groupId}/edit-photo/${id}`)
                }
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
      {showManageMembers && selectedGroup && (
        <ManageMembersPopup
          groupId={groupId!}
          onClose={closeManageMembersPopup}
        />
      )}
    </div>
  );
}
