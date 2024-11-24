import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import useGetGroupById from "../hooks/useGetGroupById";
import useDeletePhoto from "../hooks/useDeletePhoto";
import useRequestToJoinGroup from "../hooks/useRequestToJoinGroup"; // Import the new hook
import useFetchJoinRequests from "../hooks/useFetchJoinRequests"; // Import the new hook
import useApproveJoinRequest from "../hooks/useApproveJoinRequest"; // Import the new hook
//import useDeleteGroup from "../hooks/useDeleteGroup"; // Import the new hook
import { useEffect, useState } from "react";
import Post from "../ui/Post";
import ManageMembersPopup from "../ui/ManageMembersPopup"; // Import the new component

export default function Group() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const location = useLocation();

  const { group, photos: initialPhotos, loading, error, refetch } = useGetGroupById(Number(groupId)); // Add refetch
  const { deletePhoto, loadingDelete } = useDeletePhoto();
  const { requestToJoinGroup, loadingRequest } = useRequestToJoinGroup(); // Use the new hook
  const { fetchJoinRequests, joinRequests, loadingRequests } = useFetchJoinRequests(); // Use the new hook
  const { approveJoinRequest, loadingApprove } = useApproveJoinRequest(); // Use the new hook
  //const { deleteGroup, loadingDeleteGroup } = useDeleteGroup(); // Use the new hook

  const [photos, setPhotos] = useState(initialPhotos);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    if (!loading) {
      setPhotos(initialPhotos);
    }
  }, [initialPhotos, loading]);

  const handleDelete = async (photoId: number) => {
    const success = await deletePhoto(photoId);
    if (success) {
      setPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.id !== photoId),
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

  const handleRequestToJoin = async () => {
    if (groupId && authUser?.id) {
      await requestToJoinGroup(Number(groupId), authUser.id);
    }
  };

  const handleShowRequestsClick = async () => {
    if (groupId) {
      await fetchJoinRequests(Number(groupId));
      setShowRequests(true);
    }
  };

  const handleCloseRequestsClick = () => {
    setShowRequests(false);
  };

  const handleApproveRequest = async (userId: number) => {
    if (groupId) {
      await approveJoinRequest(Number(groupId), userId);
      await fetchJoinRequests(Number(groupId)); // Refresh the join requests list
      await refetch(); // Refresh the group data
    }
  };

  // const handleDeleteGroup = async () => {
  //   if (groupId) {
  //     await deleteGroup(Number(groupId));
  //     navigate("/groups");
  //   }
  // };

  const handleBackClick = () => {
    if (location.state?.from === "groups") {
      navigate("/groups");
    } else {
      navigate("/");
    }
  };

  if (loading || loadingDelete || loadingRequest || loadingRequests || loadingApprove) {
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
              onClick={handleBackClick}
            >
              ← Back to {location.state?.from === "groups" ? "Browse Groups" : "Main Page"}
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
            onClick={handleBackClick}
          >
            ← Back to {location.state?.from === "groups" ? "Browse Groups" : "Main Page"}
          </button>
        </div>

        <div className="mb-8 flex flex-col items-center bg-white p-6 shadow-md lg:flex-row lg:p-8">
          <img
            src={group?.image}
            alt="Group Avatar"
            className="mb-4 h-36 w-36 rounded-full shadow-lg lg:mb-0"
          />
          <div className="lg:ml-6 relative">
            <h1 className="text-3xl font-bold text-black-800">
              {group?.name}
            </h1>
            <p className="mt-2 text-gray-600">{group?.description}</p>
            {authUser?.id === group?.managerId && (
              <>
                <button
                  className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
                  onClick={handleManageMembersClick}
                >
                  Manage Members
                </button>
                {(group?.usersToJoin?.length ?? 0) > 0 && (
                  <div className="relative">
                    <button
                      className="mt-4 ml-4 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-yellow-600"
                      onClick={handleShowRequestsClick}
                    >
                      New Requests
                    </button>
                    {showRequests && (
                      <div className="absolute right-0 mt-2 w-48 bg-white p-4 shadow-lg">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-bold text-gray-800">Join Requests</h2>
                          <button
                            className="text-red-500"
                            onClick={handleCloseRequestsClick}
                          >
                            ×
                          </button>
                        </div>
                        <ul>
                          {joinRequests.map((request: { userId: number; user: { nickname: string } }) => (
                            <li key={request.userId} className="mt-2 flex justify-between items-center">
                              {request.user.nickname}
                              <button
                                className="text-green-500"
                                onClick={() => handleApproveRequest(request.userId)}
                              >
                                ✓
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {/* <button
                  className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
                  onClick={handleDeleteGroup}
                >
                  Delete Group
                </button> */}
              </>
            )}
            {authUser && !group?.users.some((user: { userId: number }) => user.userId === authUser.id) && (
              <button
                className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
                onClick={handleRequestToJoin}
              >
                Request to Join
              </button>
            )}
          </div>
        </div>

        {/* Photos Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Group Posts</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Post
                key={photo.id}
                photo={{
                  id: photo.id,
                  name: photo.name,
                  description: photo.description,
                  url: photo.url,
                  tags: photo.tags || [],
                  numOfLikes: photo.numOfLikes || 0,
                  numOfComments: photo.comments?.length || 0,
                  date: photo.date,
                  uploaderId: photo.uploaderId,
                  uploader: {
                    nickname: photo.uploader.nickname,
                    id: photo.uploader.id,
                  },
                }}
                onEdit={photo.uploaderId === authUser?.id ? (id: number) => navigate(`/myProfile/edit-photo/${id}`) : undefined}
                onDelete={photo.uploaderId === authUser?.id ? handleDelete : undefined}
                groupId={Number(groupId)} // Pass groupId prop
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
