import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back to Main Page */}
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

        {/* User Info Section */}
        <div className="mb-8 flex flex-col items-center rounded-lg bg-white p-6 shadow-md lg:flex-row lg:items-start lg:p-8">
          <img
            src={authUser?.image}
            alt="User Avatar"
            className="mb-4 h-36 w-36 rounded-full shadow-lg lg:mb-0"
          />
          <div className="lg:ml-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {authUser?.nickname}
            </h1>
            <p className="mt-2 text-gray-600">{authUser?.description}</p>
            <div className="mt-4 flex space-x-6 text-gray-500">
              <p>
                <span className="font-semibold text-gray-700">Posts:</span> 42
              </p>
              <p>
                <span className="font-semibold text-gray-700">Groups:</span> 5
              </p>
            </div>
            <button
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
              onClick={() => navigate(`/profile/${authUser?.id}/edit`)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Your Posts</h2>
            <button
              onClick={() => navigate(`/profile/${authUser?.id}/add-post`)}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600"
            >
              Add New Post
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg bg-white shadow-md"
              >
                <img
                  src="https://via.placeholder.com/200"
                  alt={`Post ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition hover:opacity-100">
                  <button className="mr-2 rounded-lg bg-blue-500 px-3 py-1 text-sm text-white shadow-md hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white shadow-md hover:bg-red-600">
                    Delete
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
