import { useState } from "react";
import toast from "react-hot-toast";

const useUnlikePhoto = () => {
  const [loading, setLoading] = useState(false);

  const unlikePhoto = async (photoId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/photos/${photoId}/like`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to unlike photo");
      }

      toast.success("Photo unliked!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Error unliking photo");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { unlikePhoto, loading };
};

export default useUnlikePhoto;
