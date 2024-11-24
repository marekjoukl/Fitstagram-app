import { useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";

const useFetchGroups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const { authUser } = useAuthContext();
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
      setMyGroups(data.filter((group: any) => group.users && group.users.some((user: any) => user.userId === authUser?.id)));
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