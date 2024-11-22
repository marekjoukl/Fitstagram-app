import { useState } from "react";
import toast from "react-hot-toast";

const useLikePhoto = () => {
  const [loading, setLoading] = useState(false);

  const likePhoto = async (photoId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/photos/${photoId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to like photo");
      }

      toast.success("Photo liked!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Error liking photo");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { likePhoto, loading };
};

export default useLikePhoto;
