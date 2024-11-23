
import { useState, useEffect } from "react";

const useFetchGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`/api/groups`);
      if (!res.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await res.json();
      setGroups(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, loading, error };
};

export default useFetchGroups;