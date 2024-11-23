import { useState, useEffect } from "react";

export default function useGetGroupById(groupId: number | undefined) {
  const [group, setGroup] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const getGroup = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}`);
        if (!res.ok) throw new Error("Failed to fetch group data");
        const data = await res.json();
        setGroup(data);
        setPhotos(data.photos);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getGroup();
  }, [groupId]);

  const refetch = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (!res.ok) throw new Error("Failed to fetch group data");
      const data = await res.json();
      setGroup(data);
      setPhotos(data.photos);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { group, photos, loading, error, refetch };
}