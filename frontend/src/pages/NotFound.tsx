const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white">404</h1>
        <p className="mt-2 text-lg text-gray-200">Page Not Found</p>
        <a
          href="/"
          className="mt-4 inline-block rounded-lg bg-white px-4 py-2 font-medium text-blue-500 shadow-md transition-all hover:bg-gray-200"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
