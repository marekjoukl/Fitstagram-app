import { useState, useEffect } from "react";
import useAddPost from "../hooks/useAddPost";
import { useNavigate } from "react-router-dom";
import useSearchUsers from "../hooks/useSearchUsers";

export default function AddPost() {
  const { addPost, loading } = useAddPost();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    visibleTo: [] as number[],
  });
  const [query, setQuery] = useState("");
  const { users } = useSearchUsers(query);
  const [selectedUsers, setSelectedUsers] = useState<{ id: number; nickname: string }[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserClick = (user: { id: number; nickname: string }) => {
    if (!formData.visibleTo.includes(user.id)) {
      setFormData((prev) => ({
        ...prev,
        visibleTo: [...prev.visibleTo, user.id],
      }));
      setSelectedUsers((prev) => [...prev, user]);
      setQuery(""); // Clear the search input field
    }
  };

  const handleSelectedUserClick = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      visibleTo: prev.visibleTo.filter((id) => id !== userId),
    }));
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    setSelectedUsers((prev) =>
      prev.filter((user) => formData.visibleTo.includes(user.id))
    );
  }, [formData.visibleTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPost(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Add New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Post Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter the post name"
              required
            />
          </div>

          {/* Post Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter a brief description"
              rows={3}
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter the image URL"
              required
            />
          </div>

          {/* Search Users */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Who do you want to see this post
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search for users"
            />
            <div className="mt-2 max-h-40 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="cursor-pointer p-2 bg-gray-200 hover:bg-green-200 margin-1 rounded-lg text-black"
                  onClick={() => handleUserClick(user)}
                >
                  {user.nickname}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Users */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Who will see this post:
            </label>
            <div className="mt-2 flex flex-wrap">
              {selectedUsers.length === 0 ? (
                <div className="m-1 p-2 rounded-lg bg-gray-200 text-black">Everyone</div>
              ) : (
                selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="m-1 p-2 rounded-lg bg-gray-200 cursor-pointer hover:bg-red-200 text-black"
                    onClick={() => handleSelectedUserClick(user.id)}
                  >
                    {user.nickname}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/myProfile")}
              className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
