import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useAddPost = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addPost = async (formData: {
    name: string;
    description: string;
    url: string;
    visibleTo: number[];
    tags: string[]; // Include tags field
  }) => {
    try {
      setLoading(true);
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      toast.success("Post added successfully!");
      navigate(`/myProfile`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { addPost, loading };
};

export default useAddPost;
