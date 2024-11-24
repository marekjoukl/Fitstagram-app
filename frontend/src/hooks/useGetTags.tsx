import { useEffect, useState } from "react";

type Tag = {
  id: number;
  content: string;
};

const useGetTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    setLoading(true); // Reset loading state
    try {
      const res = await fetch("/api/tags");
      if (!res.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await res.json();
      setTags(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []); // No dependencies

  return { tags, loading, error, fetchTags };
};

export default useGetTags;