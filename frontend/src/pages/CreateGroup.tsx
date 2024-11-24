import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import useCreateGroup from "../hooks/useCreateGroup";
import useSearchUsers from "../hooks/useSearchUsers";

export default function CreateGroup() {
  const { authUser } = useAuthContext();
  const { createGroup, loading: loadingCreateGroup, error: createGroupError } = useCreateGroup();
  const [query, setQuery] = useState("");
  const { users, loading, error } = useSearchUsers(query);
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<{ id: number, username: string, nickname: string, image: string }[]>([]);

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      alert("Group name cannot be empty");
      return;
    }
  
    if (!authUser?.id) {
      alert("User ID is missing");
      return;
    }
  
    const userIds = selectedUsers.map(user => user.id);
    if (!userIds.includes(authUser.id)) {
      userIds.push(authUser.id); // Ensure the creator is added to the group
    }
    const newGroup = await createGroup(groupName, authUser.id, userIds); // Pass userIds to the createGroup function
    if (newGroup) {
      alert(`Group "${newGroup.name}" created successfully!`);
      setGroupName("");
      setSelectedUsers([]);
    }
  };

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create New Group
        </h2>
        <div className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter the group name"
              required
            />
          </div>

          <div className="flex space-x-4">
            {/* Search Bar */}
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
              {/* Search Results */}
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

            {/* Selected Users */}
            <div className="w-1/2 space-y-2">
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

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
              onClick={handleCreateGroup}
              disabled={loadingCreateGroup}
            >
              {loadingCreateGroup ? "Creating..." : "Create Group"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
          {createGroupError && <p className="mt-2 text-red-500">{createGroupError}</p>}
        </div>
      </div>
    </div>
  );
}