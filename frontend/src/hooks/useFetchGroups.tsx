import { useState, useEffect } from "react";

const useFetchGroups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`/api/groups`);
      if (!res.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await res.json();
      const userId = 1; // Replace with actual user ID
      console.log(data);
      setMyGroups(data.filter((group: any) => group.users && group.users.some((user: any) => user.userId === userId)));
      setAllGroups(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { myGroups, allGroups, loading, error };
};

export default useFetchGroups;