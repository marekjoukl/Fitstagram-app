import { useState, useEffect, useCallback } from "react";

const useFetchCurrentMembers = (groupId: string) => {
  const [currentMembers, setCurrentMembers] = useState<{ id: number, username: string, nickname: string, image: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (!res.ok) throw new Error("Failed to fetch current members");
      const data = await res.json();
      if (Array.isArray(data.users)) {
        setCurrentMembers(data.users.map((userInGroup: any) => userInGroup.user));
      } else {
        throw new Error("Invalid group data");
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchCurrentMembers();
  }, [fetchCurrentMembers]);

  return { currentMembers, loading, error, fetchCurrentMembers };
};

export default useFetchCurrentMembers;