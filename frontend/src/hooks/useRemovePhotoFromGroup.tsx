
import { useState } from "react";

const useRemovePhotoFromGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removePhotoFromGroup = async (groupId: number, photoId: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/groups/remove-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, photoId }),
      });

      if (!res.ok) throw new Error('Failed to remove photo from group');
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      return null;
    }
  };

  return { removePhotoFromGroup, loading, error };
};

export default useRemovePhotoFromGroup;