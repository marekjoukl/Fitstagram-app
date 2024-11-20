import { useState } from "react";
import useAddPost from "../hooks/useAddPost";

export default function AddPost() {
  const { addPost, loading } = useAddPost();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 py-2 font-semibold text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
