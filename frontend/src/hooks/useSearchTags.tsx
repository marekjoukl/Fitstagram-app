import { useState, useEffect } from "react";
import axios from "axios";

type Tag = {
  id: number;
  content: string;
};

const useSearchTags = (query: string) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setTags([]);
      return;
    }

    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/tags/search`, {
          params: { name: query },
        });

        setTags(res.data);
      } catch (error: any) {
        setError(error.message || "Error searching tags");
        console.error("Error searching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [query]);

  return { tags, loading, error };
};

export default useSearchTags;