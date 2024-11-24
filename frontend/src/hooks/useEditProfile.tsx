import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

type ProfileInputs = {
  nickname: string;
  image: string;
  description: string;
};

const useEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const editProfile = async (inputs: ProfileInputs) => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      setAuthUser(data.user);
      toast.success("Profile updated successfully!");
      navigate("/myProfile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return { editProfile, loading };
};

export default useEditProfile;
