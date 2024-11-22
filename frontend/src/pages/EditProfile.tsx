import { useState } from "react";
import useEditProfile from "../hooks/useEditProfile";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { authUser } = useAuthContext();
  const { editProfile, loading } = useEditProfile();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: authUser?.nickname || "",
    image: authUser?.image || "",
    description: authUser?.description || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editProfile(formData);
  };

  const handleCancel = () => {
    navigate("/myProfile");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (confirmed) {
      try {
        // Add your delete account logic here
        alert("Account deleted"); // Placeholder for actual implementation
        navigate("/"); // Redirect to homepage or login after deletion
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nickname
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avatar URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500"
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
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between space-x-4">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="w-full rounded-lg bg-gray-300 py-2 font-semibold text-gray-700 hover:bg-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-red-500 py-2 font-semibold text-white hover:bg-red-600"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
}
