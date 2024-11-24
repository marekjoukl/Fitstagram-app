import { useState, useEffect } from "react";
import axios from "axios";

type Group = {
  id: number;
  name: string;
  managerId: number;
  users: { id: number; nickname: string }[]; // Include users in the group type
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

        const groupsWithMembers = await Promise.all(
          res.data.map(async (group: Group) => {
            const membersRes = await axios.get(`/api/groups/${group.id}/members`);
            return { ...group, users: membersRes.data };
          })
        );

        setGroups(groupsWithMembers);
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