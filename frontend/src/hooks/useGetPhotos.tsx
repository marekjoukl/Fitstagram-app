import { useEffect, useState } from "react";

type Photo = {
  id: number;
  name: string;
  description?: string;
  url: string;
  numOfLikes: number;
  numOfComments: number;
  date: string;
  uploader: {
    nickname: string;
    id: number;
  };
};

const useGetPhotos = (userId?: number, role?: string) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    setLoading(true); // Reset loading state
    try {
      const query = new URLSearchParams();
      if (userId) query.append("userId", userId.toString());
      if (role) query.append("role", role);
      const res = await fetch(`/api/photos?${query.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch photos");
      }
      const data = await res.json();
      setPhotos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [userId, role]); // Add userId and role as dependencies

  return { photos, loading, error, fetchPhotos };
};

export default useGetPhotos;
