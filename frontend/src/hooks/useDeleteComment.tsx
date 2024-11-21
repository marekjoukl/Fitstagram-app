import { useState } from "react";
import toast from "react-hot-toast";

const useDeleteComment = () => {
  const [loading, setLoading] = useState(false);

  const deleteComment = async (commentId: number): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/photos/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }

      toast.success("Comment deleted successfully");
      return true; // Indicate success
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete comment";
      toast.error(errorMessage);
      console.error("Error deleting comment:", errorMessage);
      return false; // Indicate failure
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  return { deleteComment, loading };
};

export default useDeleteComment;
