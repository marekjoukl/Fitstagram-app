import { useState } from "react";
import toast from "react-hot-toast";

const useDeleteTag = () => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const deleteTag = async (tagId: number) => {
    try {
      setLoadingDelete(true);
      const response = await fetch(`/api/tags/${tagId}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete tag");
      }

      toast.success("Tag deleted successfully");
      return true;
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error deleting tag:", error.message);
      return false;
    } finally {
      setLoadingDelete(false);
    }
  };
  
  return { deleteTag, loadingDelete };
}

export default useDeleteTag;