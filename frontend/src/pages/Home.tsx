import LogoutButton from "../ui/LogoutButton";

export default function Home() {
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
              src="https://via.placeholder.com/100"
              alt="User Avatar"
              className="mx-auto mb-4 h-24 w-24 rounded-full shadow-lg"
            />
            <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
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
            <button className="w-full rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-600">
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
          </div>

          {/* Add Photo Button */}
          <button className="ml-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600">
            Add Photo
          </button>
        </div>

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
