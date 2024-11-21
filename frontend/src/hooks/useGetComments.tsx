import { useEffect, useState } from "react";

type Comment = {
  id: number;
  content: string;
  author: {
    nickname: string;
    image: string;
    id: number;
  };
};

const useGetComments = (photoId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/photos/${photoId}/comments`);
        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (photoId) {
      fetchComments();
    }
  }, [photoId]);

  return { comments, setComments, loading };
};

export default useGetComments;
