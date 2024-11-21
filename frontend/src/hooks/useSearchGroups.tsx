import { useState, useEffect } from "react";
import axios from "axios";

type Group = {
  id: number;
  name: string;
  managerId: number;
};

const useSearchGroups = (query: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setGroups([]);
      return;
    }

    const fetchGroups = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/groups/search`, {
          params: { name: query },
        });

        setGroups(res.data);
      } catch (error: any) {
        setError(error.message || "Error searching groups");
        console.error("Error searching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [query]);

  return { groups, loading, error };
};

export default useSearchGroups;