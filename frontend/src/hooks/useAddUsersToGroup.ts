
import { useState } from "react";

const useAddUsersToGroup = (groupId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUsers = async (userIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/groups/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId: Number(groupId), userIds }),
      });
      if (!res.ok) throw new Error("Failed to add members");
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return { addUsers, loading, error };
};

export default useAddUsersToGroup;