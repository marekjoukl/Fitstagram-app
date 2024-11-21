import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEditPhoto from "../hooks/useEditPhoto";
import usePhoto from "../hooks/useGetPhotoById";

export default function EditPhoto() {
  const { photoId } = useParams<{ photoId: string }>();
  const navigate = useNavigate();
  const { editPhoto, loading } = useEditPhoto();
  const { photo, loading: photoLoading } = usePhoto(Number(photoId));

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
  });

  useEffect(() => {
    if (photo) {
      setFormData({
        name: photo.name || "",
        description: photo.description || "",
        url: photo.url || "",
      });
    }
  }, [photo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await editPhoto(Number(photoId), formData);
    if (success) {
      navigate("/profile");
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

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
