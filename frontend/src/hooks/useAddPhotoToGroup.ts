
import { useState } from "react";

const useAddPhotoToGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPhotoToGroup = async (groupId: number, photoId: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/groups/add-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, photoId }),
      });

      if (!res.ok) throw new Error('Failed to add photo to group');
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      return null;
    }
  };

  return { addPhotoToGroup, loading, error };
};

export default useAddPhotoToGroup;