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
  };
};

const useGetPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
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
  }, []);

  return { photos, loading, error, fetchPhotos };
};

export default useGetPhotos;
