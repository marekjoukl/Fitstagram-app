
import { useState } from "react";

const useRemoveUserFromGroup = (groupId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeUser = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/groups/remove-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId: Number(groupId), userId }),
      });
      if (!res.ok) throw new Error("Failed to remove member");
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return { removeUser, loading, error };
};

export default useRemoveUserFromGroup;