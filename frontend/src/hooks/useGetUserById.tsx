import { useState, useEffect } from "react";

export default function useGetUserById(userId: number | undefined) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [userId]);

  return { user, loading, error };
}
