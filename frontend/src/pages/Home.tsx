export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white p-6 shadow-md">
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

        {/* Buttons */}
        <div className="mt-auto flex flex-col space-y-4">
          <button className="w-full rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
            Settings
          </button>
          <button className="w-full rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            className="w-1/2 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {/* Add Photo Button */}
          <button className="ml-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:from-blue-600 hover:to-purple-600">
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
