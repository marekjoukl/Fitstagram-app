import { useState } from "react";
import useSearchUsers from "../hooks/useSearchUsers";
import useAddUsersToGroup from "../hooks/useAddUsersToGroup";
import useRemoveUserFromGroup from "../hooks/useRemoveUserFromGroup";
import useFetchCurrentMembers from "../hooks/useFetchCurrentMembers";
import { useAuthContext } from "../contexts/AuthContext";

interface ManageMembersPopupProps {
  groupId: string;
  onClose: () => void;
}

export default function ManageMembersPopup({ groupId, onClose }: ManageMembersPopupProps) {
  const [query, setQuery] = useState("");
  const { users, loading, error } = useSearchUsers(query);
  const [selectedUsers, setSelectedUsers] = useState<{ id: number, username: string, nickname: string, image: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { addUsers, error: addUsersError } = useAddUsersToGroup(groupId);
  const { removeUser, error: removeUserError } = useRemoveUserFromGroup(groupId);
  const { currentMembers, error: fetchMembersError, fetchCurrentMembers } = useFetchCurrentMembers(groupId);
  const { authUser } = useAuthContext();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleUserSelect = (user: { id: number, username: string, nickname: string, image: string }) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.find((u) => u.id === user.id)
        ? prevSelectedUsers.filter((u) => u.id !== user.id)
        : [...prevSelectedUsers, user]
    );
  };

  const handleAddMembers = async () => {
    const success = await addUsers(selectedUsers.map(user => user.id));
    if (success) {
      setSelectedUsers([]);
      fetchCurrentMembers();
    } else {
      setErrorMsg(addUsersError);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    const success = await removeUser(userId);
    if (success) {
      fetchCurrentMembers();
    } else {
      setErrorMsg(removeUserError);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
        <h2 className="text-xl font-bold mb-4">Manage Members</h2>
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        {fetchMembersError && <p className="text-red-500 mb-4">{fetchMembersError}</p>}
        <div className="flex space-x-4">
          <div className="w-1/3 space-y-2">
            {currentMembers.map((user) => (
              <div key={user.id} className="flex items-center p-2 bg-gray-100 rounded-lg">
                <img
                  src={user.image}
                  alt={user.username}
                  className="h-8 w-8 rounded-full"
                />
                <div className="ml-2 flex-1">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.nickname}</p>
                </div>
                {user.id !== authUser?.id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(user.id)}
                    className="bg-red-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="relative w-1/3">
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
                placeholder="Search..."
                value={query}
                onChange={handleSearchChange}
                className="block w-full rounded-full border border-gray-300 bg-white px-4 py-2 pl-10 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
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
            {query && (
              <div className="absolute mt-2 w-full rounded-lg bg-white shadow-lg">
                {loading && <p className="p-4">Loading...</p>}
                {error && <p className="p-4 text-red-500">{error}</p>}
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleUserSelect(user)}
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
          <div className="w-1/3 space-y-2">
            {selectedUsers.map((user) => (
              <div key={user.id} className="flex items-center p-2 bg-gray-100 rounded-lg">
                <img
                  src={user.image}
                  alt={user.username}
                  className="h-8 w-8 rounded-full"
                />
                <div className="ml-2 flex-1">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.nickname}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUsers((prevSelectedUsers) =>
                    prevSelectedUsers.filter((u) => u.id !== user.id)
                  )}
                  className="text-red-500 hover:text-red-700"
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
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
            onClick={handleAddMembers}
          >
            Add Members
          </button>
        </div>
      </div>
    </div>
  );
}
