import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import LogoutButton from "../ui/LogoutButton";
import useSearchUsers from "../hooks/useSearchUsers";
import useSearchGroups from "../hooks/useSearchGroups";

export default function Home() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [userQuery, setUserQuery] = useState("");
  const [groupQuery, setGroupQuery] = useState("");
  const { users, loading: loadingUsers, error: errorUsers } = useSearchUsers(userQuery);
  const { groups, loading: loadingGroups, error: errorGroups } = useSearchGroups(groupQuery);

  const handleGoToProfile = () => {
    if (authUser) {
      navigate(`/profile/${authUser.id}`);
    }
  };

  const handleUserSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuery(event.target.value);
  };

  const handleGroupSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupQuery(event.target.value);
  };

  const handleCreateGroup = () => {
    navigate(`/group/create`);
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
          <div className="relative w-1/2 mr-4">
            <input
              type="text"
              placeholder="Search users..."
              value={userQuery}
              onChange={handleUserSearchChange}
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
            <input
              type="text"
              placeholder="Search groups..."
              value={groupQuery}
              onChange={handleGroupSearchChange}
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
            {/* Group Search Results */}
            {groupQuery && (
              <div className="absolute mt-2 w-full rounded-lg bg-white shadow-lg">
                {loadingGroups && <p className="p-4">Loading...</p>}
                {errorGroups && <p className="p-4 text-red-500">{errorGroups}</p>}
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

        {/* Add Photo Button */}
        <button className="ml-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600">
          Add Photo
        </button>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square w-full rounded-lg bg-white shadow-md"
            >
              <img
                src="https://via.placeholder.com/200"
                alt={`Post ${index + 1}`}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}