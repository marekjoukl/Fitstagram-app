import { useState, useEffect } from "react";
import axios from "axios";
import { Photo } from "./useUserPhotos";

export default function useAllPhotos(id: number | undefined) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get("/api/photos");
        setPhotos(response.data);
      } catch (error) {
        console.error("Failed to fetch photos", error);
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchPhotos();
  }, []);

  return { photos, loadingPhotos };
}
