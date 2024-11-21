import { useState } from "react";
import toast from "react-hot-toast";

const useAddComment = () => {
  const [loading, setLoading] = useState(false);

  const addComment = async (photoId: number, content: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/photos/${photoId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add comment");
      }

      const data = await res.json();
      toast.success("Comment added successfully!");
      return data; // Ensure the returned data is in the expected format
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading };
};

export default useAddComment;
