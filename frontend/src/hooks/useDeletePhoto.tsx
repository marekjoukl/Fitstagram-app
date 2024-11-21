import { useState } from "react";
import toast from "react-hot-toast";

const useDeletePhoto = () => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const deletePhoto = async (photoId: number) => {
    try {
      setLoadingDelete(true);
      const response = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete photo");
      }

      toast.success("Photo deleted successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error deleting photo:", error.message);
      return false;
    } finally {
      setLoadingDelete(false);
    }
  };

  return { deletePhoto, loadingDelete };
};

export default useDeletePhoto;
