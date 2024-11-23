import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEditPhoto from "../hooks/useEditPhoto";
import usePhoto from "../hooks/useGetPhotoById";
import useSearchUsers from "../hooks/useSearchUsers"; // Remove the import for useGetUserById

export default function EditPhoto() {
  const { photoId } = useParams<{ photoId: string }>();
  const navigate = useNavigate();
  const { editPhoto, loading } = useEditPhoto();
  const { photo, loading: photoLoading } = usePhoto(Number(photoId)); // Remove the useGetUserById hook

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    visibleTo: [] as number[],
    tags: [] as string[],
  });
  const [query, setQuery] = useState("");
  const { users } = useSearchUsers(query);
  const [selectedUsers, setSelectedUsers] = useState<{ id: number; nickname: string }[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (photo) {
      console.log(photo);
      setFormData({
        name: photo.name || "",
        description: photo.description || "",
        url: photo.url || "",
        visibleTo: Array.isArray(photo.visibleTo) ? (photo.visibleTo as unknown as { id: number }[]).map((user) => user.id) : [],
        tags: photo.tags || [],
      });
      setSelectedUsers(Array.isArray(photo.visibleTo) ? (photo.visibleTo as unknown as { id: number; nickname: string }[]) : []);
    }
  }, [photo]);

  const handleUserClick = (user: { id: number; nickname: string }) => {
    if (!formData.visibleTo.includes(user.id)) {
      setFormData((prev) => ({
        ...prev,
        visibleTo: [...prev.visibleTo, user.id],
      }));
      setSelectedUsers((prev) => [...prev, user]);
      setQuery("");
    }
  };

  const handleSelectedUserClick = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      visibleTo: prev.visibleTo.filter((id) => id !== userId),
    }));
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await editPhoto(Number(photoId), formData);
    if (success) {
      navigate("/myProfile");
    }
  };

  if (photoLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Edit Photo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500"
              placeholder="Enter photo name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500"
              placeholder="Enter photo description"
              rows={3}
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo URL
            </label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500"
              placeholder="Enter photo URL"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter tags and press Enter"
            />
            <div className="mt-2 flex flex-wrap">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="m-1 p-2 rounded-lg bg-gray-200 cursor-pointer hover:bg-red-200 text-black"
                  onClick={() => handleTagRemove(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
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

          {/* Buttons */}
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
