import { useEffect, useState } from "react";

interface Photo {
  id: number;
  name: string;
  description?: string;
  url: string;
  numOfLikes: number;
  date: string; // Date is usually serialized as a string in JSON responses
  uploader: {
    nickname: string;
    id: number;
  };
  uploaderId: number;
  comments: [];
}

const useUserPhotos = (id: number | undefined) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoadingPhotos(true);
      try {
        const res = await fetch(`/api/photos/profile/${id}`);
        const data: Photo[] = await res.json(); // Type the response data
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchPhotos();
  }, [id]);

  return { photos, loadingPhotos };
};

export default useUserPhotos;
