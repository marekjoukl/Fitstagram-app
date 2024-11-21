import { useState, useEffect } from "react";

type Photo = {
  id: number;
  name: string;
  description: string;
  url: string;
  numOfLikes: number;
  date: string;
  uploaderId: number;
};

const usePhoto = (id: number | null) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPhoto = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/photos/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch photo: ${res.statusText}`);
        }

        const data: Photo = await res.json();
        setPhoto(data);
      } catch (error: any) {
        setError(error.message || "Error fetching photo");
        console.error("Error fetching photo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id]);

  return { photo, loading, error };
};

export default usePhoto;
