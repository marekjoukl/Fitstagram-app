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

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/photos");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch photos");
        }

        setPhotos(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return { photos, loading, error };
};

export default useGetPhotos;
